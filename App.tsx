import React, { useState } from 'react';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { CourseView } from './components/CourseView';
import { generatePillars, generateVariations, generateCourse } from './services/geminiService';
import { AppState, AppStep, Pillar, Variation, CourseData } from './types';
import { ArrowRight, BookOpen, Layers, Loader2, Target } from 'lucide-react';

const INITIAL_STATE: AppState = {
  step: AppStep.INPUT_TOPIC,
  topic: '',
  pillars: [],
  selectedPillar: null,
  variations: [],
  selectedVariation: null,
  courseData: null,
  isLoading: false,
  error: null,
};

function App() {
  const [state, setState] = useState<AppState>(INITIAL_STATE);

  const handleError = (error: any) => {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: error instanceof Error ? error.message : "Ha ocurrido un error inesperado.",
    }));
  };

  const resetApp = () => setState(INITIAL_STATE);

  const handleTopicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.topic.trim()) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const pillars = await generatePillars(state.topic);
      setState(prev => ({
        ...prev,
        step: AppStep.SELECT_PILLAR,
        pillars,
        isLoading: false,
      }));
    } catch (error) {
      handleError(error);
    }
  };

  const handlePillarSelect = async (pillar: Pillar) => {
    setState(prev => ({ ...prev, selectedPillar: pillar, isLoading: true, error: null }));
    try {
      const variations = await generateVariations(pillar);
      setState(prev => ({
        ...prev,
        step: AppStep.SELECT_VARIATION,
        variations,
        isLoading: false,
      }));
    } catch (error) {
      handleError(error);
    }
  };

  const handleVariationSelect = async (variation: Variation) => {
    setState(prev => ({ ...prev, selectedVariation: variation, isLoading: true, error: null }));
    try {
      const courseData = await generateCourse(variation);
      setState(prev => ({
        ...prev,
        step: AppStep.VIEW_COURSE,
        courseData,
        isLoading: false,
      }));
    } catch (error) {
      handleError(error);
    }
  };

  const handleBackToVariations = () => {
    setState(prev => ({
      ...prev,
      step: AppStep.SELECT_VARIATION,
      courseData: null,
      selectedVariation: null,
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header reset={resetApp} />

      <main className="flex-grow flex flex-col">
        {/* Loading Overlay */}
        {state.isLoading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 animate-pulse">
              {state.step === AppStep.INPUT_TOPIC && "Analizando el tema..."}
              {state.step === AppStep.SELECT_PILLAR && "Creando variaciones..."}
              {state.step === AppStep.SELECT_VARIATION && "Diseñando el curso completo..."}
            </h3>
            <p className="text-slate-500 mt-2 text-center max-w-md">
              {state.step === AppStep.SELECT_VARIATION 
                ? "Estamos consultando fuentes actualizadas y estructurando el contenido pedagógico. Esto puede tardar unos segundos."
                : "Tu mentor IA está trabajando en ello."}
            </p>
          </div>
        )}

        {/* Error Display */}
        {state.error && (
          <div className="max-w-md mx-auto mt-8 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3">
            <div className="font-semibold">Error:</div>
            <div>{state.error}</div>
            <button 
              onClick={() => setState(prev => ({ ...prev, error: null }))}
              className="ml-auto text-sm underline hover:text-red-800"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* STEP 0: Input Topic */}
        {state.step === AppStep.INPUT_TOPIC && (
          <div className="flex-grow flex flex-col items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="max-w-2xl w-full text-center space-y-8">
              <div className="inline-block p-4 rounded-full bg-indigo-100 text-indigo-600 mb-4">
                <Target size={40} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                ¿Sobre qué quieres <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                  enseñar hoy?
                </span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg mx-auto">
                Dime tu tema central y te ayudaré a crear una estructura de contenido profesional en minutos.
              </p>
              
              <form onSubmit={handleTopicSubmit} className="relative max-w-lg mx-auto">
                <input
                  type="text"
                  placeholder="Ej: Fotografía Digital, Liderazgo, Cocina Vegana..."
                  className="w-full px-6 py-5 rounded-2xl border-2 border-slate-200 text-lg shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
                  value={state.topic}
                  onChange={(e) => setState(prev => ({ ...prev, topic: e.target.value }))}
                  autoFocus
                />
                <Button 
                  type="submit" 
                  disabled={!state.topic.trim() || state.isLoading}
                  className="absolute right-2 top-2 bottom-2 !py-0 !px-6 rounded-xl"
                >
                  <ArrowRight size={24} />
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* STEP 1: Select Pillar */}
        {state.step === AppStep.SELECT_PILLAR && (
          <div className="max-w-7xl mx-auto px-4 py-12 w-full animate-in slide-in-from-right-8 duration-500">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold text-indigo-600 tracking-wider uppercase">Paso 1 de 3</span>
              <h2 className="text-3xl font-bold text-slate-900 mt-2">Elige un Tema Pilar</h2>
              <p className="text-slate-600 mt-2">Hemos desglosado "{state.topic}" en 10 áreas fundamentales.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {state.pillars.map((pillar) => (
                <div 
                  key={pillar.id}
                  onClick={() => handlePillarSelect(pillar)}
                  className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Layers size={64} className="text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {pillar.description}
                  </p>
                  <div className="mt-6 flex items-center text-indigo-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Seleccionar este pilar <ArrowRight size={16} className="ml-2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Select Variation */}
        {state.step === AppStep.SELECT_VARIATION && (
          <div className="max-w-5xl mx-auto px-4 py-12 w-full animate-in slide-in-from-right-8 duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-sm font-semibold text-purple-600 tracking-wider uppercase">Paso 2 de 3</span>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">Elige una Lección</h2>
                <p className="text-slate-600 mt-2">Variaciones para el pilar: <strong>{state.selectedPillar?.title}</strong></p>
              </div>
              <Button variant="ghost" onClick={() => setState(prev => ({ ...prev, step: AppStep.SELECT_PILLAR }))}>
                Cambiar Pilar
              </Button>
            </div>

            <div className="space-y-4">
              {state.variations.map((variation) => (
                <div 
                  key={variation.id}
                  onClick={() => handleVariationSelect(variation)}
                  className="flex items-center justify-between p-6 bg-white rounded-xl border border-slate-200 hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-purple-100 p-3 rounded-lg text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                        {variation.title}
                      </h3>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {variation.focus}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-full text-slate-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                    <ArrowRight size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: View Course */}
        {state.step === AppStep.VIEW_COURSE && state.courseData && (
          <CourseView 
            data={state.courseData} 
            onBack={handleBackToVariations} 
          />
        )}
      </main>
    </div>
  );
}

export default App;