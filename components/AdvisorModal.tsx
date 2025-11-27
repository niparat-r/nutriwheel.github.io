import React from 'react';
import { AdvisorResponse } from '../types';

interface AdvisorModalProps {
  advisorData: AdvisorResponse;
  onClose: () => void;
}

const AdvisorModal: React.FC<AdvisorModalProps> = ({ advisorData, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in-up">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Nutri Advisor</h2>
          </div>
          <div className="text-emerald-50 text-sm font-medium">
             คะแนนสุขภาพรวม: <span className="text-2xl font-bold ml-1">{advisorData.health_score_overall}/10</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Summary */}
          <div>
            <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">สรุปเมนูของคุณ</h3>
            <p className="text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
              {advisorData.summary_th}
            </p>
          </div>

          {/* Evaluation & Risks */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-800 text-sm mb-1">ผลประเมิน</h4>
                <p className="text-blue-900">{advisorData.evaluation_th}</p>
             </div>
             <div className="p-3 bg-red-50 rounded-lg border border-red-100">
                <h4 className="font-bold text-red-800 text-sm mb-1">สิ่งที่ต้องระวัง</h4>
                <ul className="text-xs text-red-900 list-disc list-inside">
                  {advisorData.risk_factors_th.length > 0 ? (
                    advisorData.risk_factors_th.map((risk, idx) => (
                      <li key={idx}>{risk}</li>
                    ))
                  ) : (<li>ไม่มีความเสี่ยงพิเศษ</li>)}
                </ul>
             </div>
          </div>

          {/* Advice */}
          <div>
            <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">คำแนะนำจาก AI</h3>
            <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-lg">
               <p className="text-emerald-900 italic">"{advisorData.advice_th}"</p>
            </div>
          </div>

          {/* Alternatives */}
          {advisorData.suggested_alternatives.length > 0 && (
            <div>
              <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">ลองเปลี่ยนเป็น... ดีไหม?</h3>
              <div className="space-y-2">
                {advisorData.suggested_alternatives.map((alt, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded uppercase mt-0.5">
                      {alt.from_category === 'main_dish' ? 'อาหารหลัก' : alt.from_category === 'drink' ? 'เครื่องดื่ม' : 'ของว่าง'}
                    </span>
                    <div>
                      <div className="font-bold text-slate-800">{alt.name_th}</div>
                      <div className="text-xs text-slate-500">{alt.reason_th}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
           <button 
             onClick={onClose}
             className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl hover:bg-slate-700 transition-colors"
           >
             เข้าใจแล้ว!
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdvisorModal;