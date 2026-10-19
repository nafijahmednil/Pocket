import React from 'react';
import { Plus, Check, Edit2 } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileSelectorProps {
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
  onEditProfile: (profile: UserProfile) => void;
  onAddNewProfile: () => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
  onEditProfile,
  onAddNewProfile,
}) => {
  return (
    <div className="w-full flex items-center gap-2 overflow-x-auto py-1 no-scrollbar select-none">
      {profiles.map(profile => {
        const isActive = profile.id === activeProfileId;
        const color = profile.colorHex || '#F97316';

        return (
          <div
            key={profile.id}
            onClick={() => onSelectProfile(profile.id)}
            style={{
              backgroundColor: isActive ? `${color}25` : undefined,
              borderColor: isActive ? color : undefined,
            }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 border ${
              isActive
                ? 'font-bold text-slate-900 dark:text-white shadow-xs'
                : 'bg-slate-100/80 hover:bg-slate-200/60 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent font-medium'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: color }}
            />
            <span>{profile.name}</span>

            {isActive && (
              <>
                <Check size={13} style={{ color }} className="shrink-0 stroke-[2.5]" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProfile(profile);
                  }}
                  className="w-5 h-5 rounded-full flex items-center justify-center transition-colors hover:opacity-80 ml-0.5"
                  style={{ backgroundColor: `${color}30` }}
                  title={`Edit ${profile.name}`}
                >
                  <Edit2 size={10} style={{ color }} />
                </button>
              </>
            )}
          </div>
        );
      })}

      {/* Add Profile Chip */}
      <button
        onClick={onAddNewProfile}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#FF6D00] bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/30 dark:hover:bg-orange-950/50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
      >
        <Plus size={13} className="stroke-[2.5]" />
        <span>New Profile</span>
      </button>
    </div>
  );
};
