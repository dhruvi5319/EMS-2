import React from 'react';
import { Lock } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export const SensitivityBadge: React.FC<{ sensitivity: 'standard' | 'restricted' }> = ({ sensitivity }) => {
  if (sensitivity === 'restricted') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span
              role="img"
              aria-label="Sensitivity: Restricted"
              className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[12px] font-semibold uppercase tracking-[0.05em] bg-red-100 text-red-700"
              style={{ maxWidth: 88 }}
            >
              <Lock size={12} className="text-red-700" />
              RESTRICTED
            </span>
          </TooltipTrigger>
          <TooltipContent>This evidence item is restricted. Only authorized roles can view it.</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return (
    <span
      role="img"
      aria-label="Sensitivity: Standard"
      className="inline-flex items-center rounded px-1.5 py-0.5 text-[12px] font-normal bg-gray-100 text-gray-600"
    >
      Standard
    </span>
  );
};
