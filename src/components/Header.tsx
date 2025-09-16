import React from "react";
import type { Event } from "../types";
import { CSSTransition } from "react-transition-group";

interface HeaderProps {
  pinnedEvent: Event | null;
  onUnpin: () => void;
}

export default function Header({ pinnedEvent, onUnpin }: HeaderProps) {
  return (
    <>
      <CSSTransition
        in={!pinnedEvent}
        timeout={300}
        classNames="header"
        unmountOnExit
      >
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-b from-black/90 to-gray-900/80 border border-amber-600/30 rounded-xl px-8 py-6 text-center shadow-2xl backdrop-blur-sm">
            <h1 className="text-4xl font-bold text-amber-100 mb-2">
              La Forja de una Nación Industrial
            </h1>
            <p className="text-lg text-gray-300">
              Un viaje interactivo por la historia de Estados Unidos: 1877-1914
            </p>
            <p className="mt-3 text-sm text-gray-300 max-w-3xl leading-relaxed">
              Entre 1877 y 1914, Estados Unidos vivió una transformación sin precedentes impulsada por la industria y el poder corporativo. Este período no solo atrajo a millones de inmigrantes y construyó vastas ciudades, sino que también fue el escenario de conflictos laborales y movimientos ciudadanos que dieron origen a regulaciones fundamentales. Explora en el mapa los eventos que forjaron la economía y sociedad modernas, y descubre cómo sus ecos resuenan en nuestros debates actuales sobre monopolios, derechos laborales y protección al consumidor.
            </p>
            <div className="mt-3 text-xs text-gray-400">
              <p>
                Autor:{" "}
                <span className="text-amber-300 font-medium">
                  Jeancarlo Javier Quintana Centeno
                </span>{" "}
                | Profesor:{" "}
                <span className="text-amber-300 font-medium">
                  Diego Sarmiento Delgado
                </span>{" "}
                | Curso:{" "}
                <span className="text-amber-300 font-medium">
                  US HISTORY SINCE 1877
                </span>
              </p>
            </div>
          </div>
        </div>
      </CSSTransition>

      <CSSTransition
        in={!!pinnedEvent}
        timeout={300}
        classNames="event-detail"
        unmountOnExit
      >
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-2xl">
          {pinnedEvent && (
            <div className="bg-gradient-to-b from-black/90 to-gray-900/80 backdrop-blur-sm border border-amber-600/30 rounded-xl w-full max-h-[calc(100vh-4rem)] overflow-y-auto shadow-2xl text-white">
              <button
                onClick={onUnpin}
                className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all duration-300 border border-amber-600/30 z-10"
                aria-label="Back to map"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="relative">
                <img
                  src={pinnedEvent.image}
                  alt={pinnedEvent.title}
                  className="w-full h-64 object-cover rounded-t-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-t-xl"></div>
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-amber-100">
                    {pinnedEvent.title}
                  </h2>
                  <span className="bg-amber-900/80 backdrop-blur-sm text-amber-100 px-3 py-1 rounded-full text-lg font-semibold border border-amber-600/30">
                    {pinnedEvent.year}
                  </span>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-amber-200 mb-2">
                    Contexto Histórico
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {pinnedEvent.description}
                  </p>
                </div>

                <div className="bg-amber-900/80 backdrop-blur-sm p-4 rounded-lg border border-amber-600/30">
                  <h3 className="text-lg font-semibold text-amber-100 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Conexión Moderna
                  </h3>
                  <p className="text-amber-200 leading-relaxed">
                    {pinnedEvent.modernConnection}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-400">
                      Significado Histórico:
                    </span>
                    <div className="flex">
                      {[...Array(10)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < pinnedEvent.significance
                              ? "text-amber-400"
                              : "text-gray-600"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CSSTransition>
    </>
  );
}