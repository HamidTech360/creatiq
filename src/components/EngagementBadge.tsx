import { cn } from '@/lib/utils';

interface EngagementBadgeProps {
    score: number;
    className?: string;
}

export function EngagementBadge({ score, className }: EngagementBadgeProps) {
    const color = score >= 70 ? 'bg-green-500/10 text-green-600' : score >= 40 ? 'bg-orange-500/10 text-orange-600' : 'bg-red-500/10 text-red-600';
    return (
        <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest', color, className)}>
            {score}% Match
        </span>
    );
}
