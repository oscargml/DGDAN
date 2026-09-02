/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PressFeed } from './components/PressFeed';
import { CableGenerator } from './components/CableGenerator';
import { ManualIngestModal } from './components/ManualIngestModal';
import { SourceDirectory } from './components/SourceDirectory';
import { CableArchive } from './components/CableArchive';
import { PressArticle, DiplomaticCable } from './types';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

const INITIAL_LOCAL_STORAGE_KEY = 'dgedan_north_texas_articles_v1';
const CABLES_LOCAL_STORAGE_KEY = 'dgedan_north_texas_cables_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'cable' | 'ingest' | 'sources' | 'archive'>('feed');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [articles, setArticles] = useState<PressArticle[]>([]);
  const [cables, setCables] = useState<DiplomaticCable[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Initial Load from Server API or LocalStorage
  useEffect(() => {
    const savedCables = localStorage.getItem(CABLES_LOCAL_STORAGE_KEY);
    if (savedCables) {
      try {
        setCables(JSON.parse(savedCables));
      } catch (e) {
        console.error('Error parsing stored cables:', e);
      }
    }

    const savedArticles = localStorage.getItem(INITIAL_LOCAL_STORAGE_KEY);
    if (savedArticles) {
      try {
        const parsed = JSON.parse(savedArticles);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setArticles(parsed);
          return;
        }
      } catch (e) {
        console.error('Error parsing stored articles:', e);
      }
    }

    // If no articles in localStorage, fetch from backend scan-press
    handleScanPress();
  }, []);

  // Persist articles when updated
  useEffect(() => {
    if (articles.length > 0) {
      localStorage.setItem(INITIAL_LOCAL_STORAGE_KEY, JSON.stringify(articles));
    }
  }, [articles]);

  // Persist cables when updated
  useEffect(() => {
    localStorage.setItem(CABLES_LOCAL_STORAGE_KEY, JSON.stringify(cables));
  }, [cables]);

  // Trigger Press Scanning with Gemini & Google Search Grounding
  const handleScanPress = async () => {
    setIsScanning(true);
    showToast('Iniciando escaneo de prensa diaria en Norte de Texas con Gemini y Google Search...', 'info');
    try {
      const response = await fetch('/api/scan-press', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ forceRefresh: true }),
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.articles)) {
        setArticles(data.articles);
        if (data.quotaLimited) {
          showToast(
            `Base de inteligencia diplomática actualizada (${data.articles.length} acontecimientos clasificados en los 13 ejes).`,
            'success'
          );
        } else {
          showToast(
            `¡Escaneo exitoso! Se compilaron ${data.articles.length} acontecimientos de Norte de Texas clasificados en los 13 ejes DGEDAN.`,
            'success'
          );
        }
      } else {
        showToast('Se cargaron los acontecimientos verificados de la circunscripción.', 'info');
      }
    } catch (err) {
      console.warn('Error calling scan-press, using current data state:', err);
      showToast('Se mantuvieron los acontecimientos de inteligencia diplomática en pantalla.', 'info');
    } finally {
      setIsScanning(false);
    }
  };

  // Toggle selection of an article for the daily dispatch
  const handleToggleSelectArticle = (id: string) => {
    setArticles((prev) =>
      prev.map((art) => (art.id === id ? { ...art, selectedForReport: !art.selectedForReport } : art))
    );
  };

  // Select all articles
  const handleSelectAllArticles = () => {
    setArticles((prev) => prev.map((art) => ({ ...art, selectedForReport: true })));
    showToast('Todas las notas han sido seleccionadas para el Despacho Oficial.', 'success');
  };

  // Deselect all articles
  const handleDeselectAllArticles = () => {
    setArticles((prev) => prev.map((art) => ({ ...art, selectedForReport: false })));
    showToast('Se deseleccionaron todas las notas del Despacho Oficial.', 'info');
  };

  // Add custom manual or analyzed article
  const handleAddArticle = (newArt: PressArticle) => {
    setArticles((prev) => [newArt, ...prev]);
    showToast(`Nota agregada exitosamente: "${newArt.title.slice(0, 50)}..."`, 'success');
    setActiveTab('feed');
  };

  // Save a cable to archive
  const handleSaveCableToArchive = (cable: DiplomaticCable) => {
    setCables((prev) => [cable, ...prev]);
    showToast(`Despacho ${cable.code} archivado exitosamente.`, 'success');
  };

  // Delete a cable from archive
  const handleDeleteCable = (id: string) => {
    setCables((prev) => prev.filter((c) => c.id !== id));
    showToast('Despacho eliminado del archivo histórico.', 'info');
  };

  const selectedArticles = articles.filter((a) => a.selectedForReport);

  return (
    <div className="min-h-screen bg-[#f0f2f5] text-[#1e293b] flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200 max-w-md ${
            toastMessage.type === 'success'
              ? 'bg-[#00472e] text-white border-[#b5a269]'
              : toastMessage.type === 'error'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : 'bg-[#0c2340] text-white border-[#b5a269]'
          }`}
        >
          {toastMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-[#b5a269] shrink-0" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toastMessage.type === 'info' && <RefreshCw className="w-4 h-4 text-sky-400 shrink-0 animate-spin" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Main Header & Protocol Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onScanPress={handleScanPress}
        isScanning={isScanning}
        selectedArticlesCount={selectedArticles.length}
        totalArticlesCount={articles.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'feed' && (
          <PressFeed
            articles={articles}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onToggleSelectArticle={handleToggleSelectArticle}
            onSelectAllArticles={handleSelectAllArticles}
            onDeselectAllArticles={handleDeselectAllArticles}
            onNavigateToCable={() => setActiveTab('cable')}
            onScanPress={handleScanPress}
            isScanning={isScanning}
          />
        )}

        {activeTab === 'cable' && (
          <CableGenerator
            selectedArticles={selectedArticles}
            onSaveCableToArchive={handleSaveCableToArchive}
            onNavigateToFeed={() => setActiveTab('feed')}
          />
        )}

        {activeTab === 'ingest' && (
          <ManualIngestModal
            onAddArticle={handleAddArticle}
          />
        )}

        {activeTab === 'sources' && (
          <SourceDirectory />
        )}

        {activeTab === 'archive' && (
          <CableArchive
            cables={cables}
            onDeleteCable={handleDeleteCable}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-[#0c2340] border-t-2 border-[#b5a269] text-[#94a3b8] text-xs py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-semibold text-white tracking-wide">
              Dirección General de Estrategia Diplomática para América del Norte (DGEDAN)
            </div>
            <div className="text-[11px] text-[#94a3b8]">
              Subsecretaría para América del Norte (SSAN) • Secretaría de Relaciones Exteriores • Gobierno de México
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-[#94a3b8] space-y-0.5">
            <div>Canal Oficial: <span className="font-mono text-[#b5a269]">dgedanorte@sre.gob.mx</span> (CC: <span className="font-mono text-slate-300">ssan@sre.gob.mx</span>)</div>
            <div className="tracking-wider uppercase text-[10px] text-slate-400">Circunscripción Norte de Texas · Dallas · Fort Worth · Arlington · Plano · Irving</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
