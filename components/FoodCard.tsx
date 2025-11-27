import React from 'react';
import { FoodItem } from '../types';

interface FoodCardProps {
  item: FoodItem;
  label: string;
  colorClass: string;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, label, colorClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col border border-slate-100 hover:shadow-lg transition-shadow">
      <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${colorClass}`}>
        {label}
      </div>
      <h3 className="text-lg font-bold text-slate-800 leading-tight mb-1">{item.name_th}</h3>
      <p className="text-xs text-slate-500 mb-3">{item.name_en}</p>
      
      <div className="mt-auto">
        <div className="flex items-center justify-between text-sm mb-2">
           <span className="font-semibold text-slate-700">{item.calories_kcal} kcal</span>
           <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium 
             ${item.health_score >= 8 ? 'bg-green-100 text-green-700' : 
               item.health_score >= 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
             Score: {item.health_score}
           </span>
        </div>
        
        <div className="grid grid-cols-4 gap-1 text-[10px] text-slate-500 bg-slate-50 p-2 rounded-lg">
          <div className="text-center">
            <div className="font-bold">{item.protein_g}</div>
            <div>Prot</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{item.carb_g}</div>
            <div>Carb</div>
          </div>
          <div className="text-center">
            <div className="font-bold">{item.fat_g}</div>
            <div>Fat</div>
          </div>
          <div className="text-center">
            <div className={`font-bold ${item.sugar_g > 15 ? 'text-red-500' : ''}`}>{item.sugar_g}</div>
            <div>Sug</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;