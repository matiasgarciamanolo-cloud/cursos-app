import React, { useState } from 'react';
import { CourseData } from '../types';
import { Button } from './Button';
import { ArrowLeft, CheckCircle, HelpCircle, Book, ExternalLink } from 'lucide-react';

interface CourseViewProps {
  data: CourseData;
  onBack: () => void;
}

export const CourseView: React.FC<CourseViewProps> = ({ data, onBack }) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const calculateScore = () => {
    let correct = 0;
    data.quiz.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswerIndex) correct++;
    });
    return correct;
  };

  // Dynamically set CSS variable for theme color
  const style = { '--theme-color': data.themeColor } as React.CSSProperties;

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 pt-6 animate-fade-in" style={style}>
      
      {/* Navigation */}
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 pl-0 hover:bg-transparent hover:text-indigo-600">
          <ArrowLeft size={20} />
          Volver a Variaciones
        </Button>
      </div>

      {/* Hero Header */}
      <div 
        className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-8 md:p-12 mb-8 shadow-2xl"
      >
        <div className="absolute inset-0 opacity-20 bg-[color:var(--theme-color)] mix-blend-overlay"></div>
        <div className="relative z-10">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
            Curso Generado
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">{data.title}</h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl">{data.subtitle}</p>
        </div>
      </div>

      {/* Grounding / Citations */}
      {data.groundingSources && data.groundingSources.length > 0 && (
        <div className="mb-8 bg-blue-50 border border-blue-100 p-4 rounded-xl">
            <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wide mb-2 flex items-center gap-2">
                <ExternalLink size={14}/> Fuentes utilizadas
            </h4>
            <div className="flex flex-wrap gap-2">
                {data.groundingSources.map((source, i) => (
                    <a 
                        key={i} 
                        href={source.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs bg-white text-blue-600 px-3 py-1 rounded-full border border-blue-200 hover:bg-blue-600 hover:text-white transition-colors truncate max-w-[200px]"
                        title={source.title}
                    >
                        {source.title || new URL(source.uri).hostname}
                    </a>
                ))}
            </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-1">
        {data.blocks.map((block, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 rounded-t-lg font-medium transition-colors relative top-px ${
              activeTab === idx
                ? 'text-[color:var(--theme-color)] border-b-2 border-[color:var(--theme-color)] bg-slate-50'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span className="mr-2 text-xs opacity-50">0{idx + 1}</span>
            {block.title}
          </button>
        ))}
        <button
          onClick={() => setActiveTab(data.blocks.length)}
          className={`px-4 py-2 rounded-t-lg font-medium transition-colors relative top-px ${
            activeTab === data.blocks.length
              ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="mr-2 text-xs opacity-50">TEST</span>
          Evaluación
        </button>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
        
        {/* Course Blocks */}
        {activeTab < data.blocks.length && (
          <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div className="order-2 md:order-1">
                <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Book className="text-[color:var(--theme-color)]" size={24} />
                  {data.blocks[activeTab].title}
                </h2>
                
                <div className="prose prose-slate max-w-none text-slate-600 mb-6 leading-relaxed whitespace-pre-line">
                  {data.blocks[activeTab].content}
                </div>

                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500" />
                    Puntos Clave
                  </h3>
                  <ul className="space-y-2">
                    {data.blocks[activeTab].keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--theme-color)] mt-2 shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <div className="sticky top-24">
                  <div className="rounded-2xl overflow-hidden shadow-lg aspect-video bg-slate-200 relative group">
                    <img 
                      src={`https://picsum.photos/800/600?random=${activeTab}&grayscale`}
                      alt={data.blocks[activeTab].imageKeyword}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                      <span className="text-white text-sm font-medium bg-black/30 backdrop-blur-sm px-2 py-1 rounded">
                        Img: {data.blocks[activeTab].imageKeyword}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === data.blocks.length && (
          <div className="p-6 md:p-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <HelpCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Evaluación de Conocimientos</h2>
              <p className="text-slate-500">Pon a prueba lo que has aprendido en este módulo.</p>
            </div>

            <div className="space-y-8">
              {data.quiz.map((q, qIdx) => (
                <div key={qIdx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                  <h3 className="text-lg font-medium text-slate-900 mb-4">
                    {qIdx + 1}. {q.question}
                  </h3>
                  <div className="space-y-3">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = quizAnswers[qIdx] === oIdx;
                      const isCorrect = q.correctAnswerIndex === oIdx;
                      
                      let btnClass = "w-full text-left p-4 rounded-xl border transition-all duration-200 flex justify-between items-center ";
                      
                      if (showResults) {
                        if (isCorrect) btnClass += "bg-green-100 border-green-500 text-green-800";
                        else if (isSelected && !isCorrect) btnClass += "bg-red-50 border-red-200 text-red-800";
                        else btnClass += "bg-white border-slate-200 opacity-50";
                      } else {
                        if (isSelected) btnClass += "bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm";
                        else btnClass += "bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
                      }

                      return (
                        <button
                          key={oIdx}
                          disabled={showResults}
                          onClick={() => handleAnswer(qIdx, oIdx)}
                          className={btnClass}
                        >
                          <span>{opt}</span>
                          {showResults && isCorrect && <CheckCircle size={20} className="text-green-600" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              {!showResults ? (
                <Button 
                  onClick={() => setShowResults(true)} 
                  disabled={Object.keys(quizAnswers).length < data.quiz.length}
                  className="w-full md:w-auto min-w-[200px]"
                >
                  Ver Resultados
                </Button>
              ) : (
                <div className="bg-indigo-900 text-white p-6 rounded-xl animate-in zoom-in duration-300">
                  <p className="text-2xl font-bold mb-2">
                    Tu Puntuación: {calculateScore()} / {data.quiz.length}
                  </p>
                  <p className="text-indigo-200">
                    {calculateScore() === data.quiz.length 
                      ? "¡Perfecto! Has dominado este tema." 
                      : "Buen intento. Repasa los bloques para mejorar."}
                  </p>
                  <Button variant="secondary" onClick={() => {
                    setShowResults(false);
                    setQuizAnswers({});
                    setActiveTab(0);
                  }} className="mt-4">
                    Reiniciar Test
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};