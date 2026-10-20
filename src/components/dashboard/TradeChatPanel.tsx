'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  XMarkIcon,
  TrashIcon,
  DocumentIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  ArrowUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { PlayIcon } from '@heroicons/react/24/solid';
import { useAuth } from '@/contexts/AuthContext';
import { resolveStorageUrl } from '@/lib/storage';
import {
  TradeMessage,
  fetchTradeMessages,
  sendTradeMessage,
  markTradeMessagesRead,
  deleteTradeMessage,
} from '@/lib/chatService';

const POLL_INTERVAL_MS = 8000;
const MAX_FILE_SIZE = 20 * 1024 * 1024; // matches backend `max:20480` (KB)
const MAX_ATTACHMENTS = 5;

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'webm'];

function getExtension(url: string) {
  const clean = url.split('?')[0];
  const parts = clean.split('.');
  return parts.length > 1 ? (parts.pop() as string).toLowerCase() : '';
}

function getAttachmentKind(url: string): 'image' | 'video' | 'file' {
  const ext = getExtension(url);
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image';
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video';
  return 'file';
}

function getFileName(url: string) {
  const clean = url.split('?')[0];
  const segments = clean.split('/');
  return decodeURIComponent(segments[segments.length - 1] || 'attachment');
}

function mergeMessages(existing: TradeMessage[], incoming: TradeMessage[]): TradeMessage[] {
  const map = new Map(existing.map((m) => [m.id, m]));
  incoming.forEach((m) => map.set(m.id, m));
  return Array.from(map.values()).sort((a, b) => a.id - b.id);
}

interface PendingFile {
  file: File;
  previewUrl: string | null;
}

interface GalleryItem {
  url: string;
  rawUrl: string;
  kind: 'image' | 'video' | 'file';
}

interface TradeChatPanelProps {
  tradeNumber: string;
}

export function TradeChatPanel({ tradeNumber }: TradeChatPanelProps) {
  const { user } = useAuth();
  const currentUserId = user?.id;

  const [messages, setMessages] = useState<TradeMessage[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [sending, setSending] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const galleryItems = useMemo<GalleryItem[]>(() => {
    const items: GalleryItem[] = [];
    messages.forEach((m) => {
      if (m.deleted_at || !m.attachment_path) return;
      m.attachment_path.forEach((rawUrl) => {
        items.push({ rawUrl, url: resolveStorageUrl(rawUrl), kind: getAttachmentKind(rawUrl) });
      });
    });
    return items;
  }, [messages]);

  const openGallery = (rawUrl: string) => {
    const idx = galleryItems.findIndex((item) => item.rawUrl === rawUrl);
    setGalleryIndex(idx >= 0 ? idx : 0);
  };

  useEffect(() => {
    if (galleryIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGalleryIndex(null);
      else if (e.key === 'ArrowLeft') setGalleryIndex((i) => (i === null ? null : Math.max(0, i - 1)));
      else if (e.key === 'ArrowRight') setGalleryIndex((i) => (i === null ? null : Math.min(galleryItems.length - 1, i + 1)));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [galleryIndex, galleryItems.length]);

  const isNearBottom = () => {
    const el = containerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 150;
  };

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    requestAnimationFrame(() => bottomRef.current?.scrollIntoView({ behavior }));
  }, []);

  const markRead = useCallback(async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    try {
      await markTradeMessagesRead(tradeNumber, token);
      setMessages((prev) =>
        prev.map((m) => (m.user_id !== currentUserId && !m.read_at ? { ...m, read_at: new Date().toISOString() } : m))
      );
    } catch {
      // Non-critical — silently ignore, next poll will retry
    }
  }, [tradeNumber, currentUserId]);

  const loadPage = useCallback(
    async (pageToLoad: number, { silent = false }: { silent?: boolean } = {}) => {
      const token = localStorage.getItem('access_token');
      if (!token) return;
      try {
        const result = await fetchTradeMessages(tradeNumber, token, pageToLoad);
        const hadUnreadFromOther = result.data.some((m) => m.user_id !== currentUserId && !m.read_at);
        setMessages((prev) => mergeMessages(prev, result.data));
        setLastPage(result.last_page);
        setPage(result.current_page);
        if (hadUnreadFromOther) markRead();
      } catch (err) {
        if (!silent) console.error('Failed to load trade messages', err);
      }
    },
    [tradeNumber, currentUserId, markRead]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setInitialLoading(true);
      await loadPage(1);
      if (!cancelled) {
        setInitialLoading(false);
        scrollToBottom();
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeNumber]);

  useEffect(() => {
    const interval = setInterval(() => {
      const shouldStickToBottom = isNearBottom();
      loadPage(1, { silent: true }).then(() => {
        if (shouldStickToBottom) scrollToBottom('smooth');
      });
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [loadPage, scrollToBottom]);

  useEffect(() => {
    return () => {
      pendingFiles.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLoadOlder = async () => {
    if (loadingOlder || page >= lastPage) return;
    const el = containerRef.current;
    const prevScrollHeight = el?.scrollHeight ?? 0;
    setLoadingOlder(true);
    await loadPage(page + 1);
    setLoadingOlder(false);
    requestAnimationFrame(() => {
      if (el) el.scrollTop = el.scrollHeight - prevScrollHeight;
    });
  };

  const handleFileSelect = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    const accepted: PendingFile[] = [];
    for (const file of incoming) {
      if (pendingFiles.length + accepted.length >= MAX_ATTACHMENTS) {
        toast.error(`You can attach up to ${MAX_ATTACHMENTS} files per message`);
        break;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds the 20MB limit`);
        continue;
      }
      accepted.push({
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      });
    }
    setPendingFiles((prev) => [...prev, ...accepted]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => {
      const target = prev[index];
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSend = async () => {
    const trimmed = messageText.trim();
    if (!trimmed && pendingFiles.length === 0) return;
    const token = localStorage.getItem('access_token');
    if (!token) return;

    setSending(true);
    try {
      const sent = await sendTradeMessage(tradeNumber, token, {
        message: trimmed || undefined,
        attachments: pendingFiles.map((p) => p.file),
      });
      setMessages((prev) => mergeMessages(prev, [sent]));
      setMessageText('');
      pendingFiles.forEach((p) => p.previewUrl && URL.revokeObjectURL(p.previewUrl));
      setPendingFiles([]);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
      scrollToBottom('smooth');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('access_token');
    if (!token) return;
    setDeletingId(id);
    try {
      await deleteTradeMessage(tradeNumber, token, id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, deleted_at: new Date().toISOString() } : m)));
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  const lastOwnMessage = [...messages].reverse().find((m) => m.user_id === currentUserId && !m.deleted_at);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em]">Trade Chat</h2>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[10px] font-black text-green-600 uppercase tracking-wider">Support Online</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="space-y-5 max-h-[28rem] overflow-y-auto pr-1 -mr-1"
      >
        {initialLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gold-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10">
            <ChatBubbleLeftRightIcon className="w-10 h-10 text-gray-200 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-sm font-bold text-gray-400 italic">No messages yet. Start the conversation below.</p>
          </div>
        ) : (
          <>
            {page < lastPage && (
              <div className="flex justify-center">
                <button
                  onClick={handleLoadOlder}
                  disabled={loadingOlder}
                  className="flex items-center gap-1.5 px-4 py-1.5 text-[11px] font-bold text-gray-500 hover:text-gold-700 bg-gray-50 dark:bg-gray-800 rounded-full transition-colors disabled:opacity-50"
                >
                  {loadingOlder ? (
                    <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-current" />
                  ) : (
                    <ArrowUpIcon className="w-3 h-3" />
                  )}
                  Load older messages
                </button>
              </div>
            )}

            {messages.map((m, idx) => {
              const isOwn = m.user_id === currentUserId;
              const prev = messages[idx - 1];
              const showHeader = !prev || prev.user_id !== m.user_id;
              const isDeleted = !!m.deleted_at;

              return (
                <div key={m.id} className={`flex items-end gap-2.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
                    {showHeader ? (
                      m.user.profile_picture_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={m.user.profile_picture_url} alt={m.user.name} className="w-full h-full object-cover" />
                      ) : (
                        <div
                          className={`w-full h-full flex items-center justify-center text-white font-bold text-[11px] bg-gradient-to-tr ${
                            isOwn ? 'from-gold-500 to-orange-500' : 'from-blue-500 to-indigo-600'
                          }`}
                        >
                          {m.user.name?.charAt(0) || 'U'}
                        </div>
                      )
                    ) : (
                      <div className="w-7 h-7" />
                    )}
                  </div>

                  <div className={`max-w-[75%] flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                    {showHeader && (
                      <p className={`text-[10px] font-bold uppercase mb-1.5 ${isOwn ? 'mr-1 text-gold-700 dark:text-gold-400' : 'ml-1 text-gray-400'}`}>
                        {isOwn ? 'You' : m.user.name}
                      </p>
                    )}

                    {isDeleted ? (
                      <div
                        className={`px-5 py-3 rounded-[1.5rem] italic text-xs font-medium ${
                          isOwn
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-br-none'
                            : 'bg-gray-50 dark:bg-gray-800/50 text-gray-400 rounded-bl-none'
                        }`}
                      >
                        Message deleted
                      </div>
                    ) : (
                      <div className="group relative">
                        <div
                          className={`px-5 py-3 rounded-[1.5rem] text-sm leading-relaxed break-words ${
                            isOwn
                              ? 'bg-gold-500 text-ink rounded-br-none'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-bl-none'
                          }`}
                        >
                          {m.message && <p className="whitespace-pre-wrap">{m.message}</p>}

                          {m.attachment_path && m.attachment_path.length > 0 && (
                            <div className={`flex flex-wrap gap-2 ${m.message ? 'mt-2.5' : ''}`}>
                              {m.attachment_path.map((rawUrl, i) => {
                                const kind = getAttachmentKind(rawUrl);
                                const url = resolveStorageUrl(rawUrl);
                                if (kind === 'image') {
                                  return (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      key={i}
                                      src={url}
                                      alt="attachment"
                                      onClick={() => openGallery(rawUrl)}
                                      onError={(e) => {
                                        e.currentTarget.onerror = null;
                                        e.currentTarget.src =
                                          'data:image/svg+xml;utf8,' +
                                          encodeURIComponent(
                                            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="%23999" stroke-width="1"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 15l4-4 4 4 6-6 4 4"/></svg>'
                                          );
                                        e.currentTarget.classList.add('p-6', 'opacity-40');
                                      }}
                                      className="w-28 h-28 object-cover rounded-2xl cursor-pointer border border-white/20"
                                    />
                                  );
                                }
                                if (kind === 'video') {
                                  return (
                                    <div
                                      key={i}
                                      onClick={() => openGallery(rawUrl)}
                                      className="relative w-28 h-28 rounded-2xl cursor-pointer border border-white/20 overflow-hidden bg-black/20"
                                    >
                                      <video src={url} preload="metadata" muted className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                                        <div className="p-2.5 bg-white/90 rounded-full shadow-md">
                                          <PlayIcon className="w-4 h-4 text-gray-900 translate-x-[1px]" />
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return (
                                  <button
                                    key={i}
                                    onClick={() => openGallery(rawUrl)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold ${
                                      isOwn ? 'bg-white/10 hover:bg-white/20' : 'bg-white dark:bg-gray-900 hover:shadow-sm'
                                    }`}
                                  >
                                    <DocumentIcon className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate max-w-[8rem]">{getFileName(rawUrl)}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {isOwn && (
                          <button
                            onClick={() => handleDelete(m.id)}
                            disabled={deletingId === m.id}
                            className="absolute -left-7 top-1/2 -translate-y-1/2 p-1.5 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-600 transition-opacity"
                            title="Delete message"
                          >
                            {deletingId === m.id ? (
                              <span className="block animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-current" />
                            ) : (
                              <TrashIcon className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    )}

                    <div className={`flex items-center gap-1 mt-1.5 ${isOwn ? 'mr-1' : 'ml-1'}`}>
                      <p className="text-[10px] text-gray-400 font-medium">{format(new Date(m.created_at), 'MMM d, p')}</p>
                      {isOwn && !isDeleted && m.id === lastOwnMessage?.id && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-gray-400">
                          <CheckIcon className="w-3 h-3" />
                          {m.read_at ? 'Seen' : 'Sent'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {pendingFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100 dark:border-gray-800">
          {pendingFiles.map((p, i) => (
            <div key={i} className="relative group">
              {p.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.previewUrl} alt={p.file.name} className="w-14 h-14 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
              ) : (
                <div className="w-14 h-14 flex flex-col items-center justify-center gap-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <DocumentIcon className="w-5 h-5 text-gray-400" />
                </div>
              )}
              <button
                onClick={() => removePendingFile(i)}
                className="absolute -top-1.5 -right-1.5 p-0.5 bg-gray-900 text-white rounded-full shadow-md"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-end gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={sending}
          className="p-3 text-gray-400 hover:text-gold-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors flex-shrink-0 disabled:opacity-50"
          title="Attach files"
        >
          <PaperClipIcon className="w-5 h-5" />
        </button>

        <textarea
          ref={textareaRef}
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          disabled={sending}
          className="flex-1 resize-none bg-gray-50 dark:bg-gray-800 rounded-2xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 border border-transparent focus:border-gold-200 dark:focus:border-gold-900/50 focus:outline-none focus:ring-2 focus:ring-gold-500/10 disabled:opacity-60 max-h-[120px]"
        />

        <button
          onClick={handleSend}
          disabled={sending || (!messageText.trim() && pendingFiles.length === 0)}
          className="p-3 bg-gold-500 text-ink rounded-2xl hover:bg-gold-600 hover:shadow-lg hover:shadow-gold-500/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
        >
          {sending ? (
            <span className="block animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
          ) : (
            <PaperAirplaneIcon className="w-5 h-5" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {galleryIndex !== null && galleryItems[galleryIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setGalleryIndex(null)}
          >
            <div className="absolute top-6 left-0 right-0 flex items-center justify-between px-6">
              <span className="text-white/70 text-xs font-black uppercase tracking-widest">
                {galleryIndex + 1} / {galleryItems.length}
              </span>
              <button
                onClick={() => setGalleryIndex(null)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {galleryIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGalleryIndex(galleryIndex - 1);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
            )}
            {galleryIndex < galleryItems.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setGalleryIndex(galleryIndex + 1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            )}

            <motion.div
              key={galleryIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-4xl w-full max-h-[70vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {galleryItems[galleryIndex].kind === 'image' && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={galleryItems[galleryIndex].url}
                  alt="attachment"
                  className="max-w-full max-h-[70vh] object-contain rounded-2xl shadow-2xl"
                />
              )}
              {galleryItems[galleryIndex].kind === 'video' && (
                <video
                  key={galleryItems[galleryIndex].url}
                  src={galleryItems[galleryIndex].url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl"
                />
              )}
              {galleryItems[galleryIndex].kind === 'file' && (
                <div className="flex flex-col items-center gap-4 p-10 bg-white/5 rounded-3xl">
                  <DocumentIcon className="w-16 h-16 text-white/60" />
                  <p className="text-white font-bold text-sm max-w-xs text-center break-words">
                    {getFileName(galleryItems[galleryIndex].rawUrl)}
                  </p>
                  <a
                    href={galleryItems[galleryIndex].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-gold-500 hover:bg-gold-600 text-ink rounded-xl text-sm font-bold transition-colors"
                  >
                    <ArrowDownTrayIcon className="w-4 h-4" /> Download
                  </a>
                </div>
              )}
            </motion.div>

            {galleryItems.length > 1 && (
              <div
                className="mt-6 flex gap-2 overflow-x-auto max-w-full px-4 pb-1"
                onClick={(e) => e.stopPropagation()}
              >
                {galleryItems.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => setGalleryIndex(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      i === galleryIndex ? 'border-gold-500' : 'border-transparent opacity-50 hover:opacity-80'
                    }`}
                  >
                    {item.kind === 'image' ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    ) : item.kind === 'video' ? (
                      <video src={item.url} muted preload="metadata" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center">
                        <DocumentIcon className="w-5 h-5 text-white/60" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
