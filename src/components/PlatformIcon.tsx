import { Linkedin, Facebook, Instagram, Music2, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom X (formerly Twitter) logo component
const XLogo = ({ size, className, style }: { size?: number, className?: string, style?: any }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        style={style}
    >
        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.482 3.239H4.293L17.607 20.65z" />
    </svg>
);

const platformStyles: Record<string, { icon: React.FC<{ size?: number; strokeWidth?: number; className?: string; style?: any }>; color: string; isSvg?: boolean }> = {
    linkedin: { icon: Linkedin, color: '#0077B5' },
    twitter: { icon: XLogo as any, color: '#000000', isSvg: true },
    x: { icon: XLogo as any, color: '#000000', isSvg: true },
    facebook: { icon: Facebook, color: '#1877F2' },
    instagram: { icon: Instagram, color: '#E4405F' },
    tiktok: { icon: Music2, color: '#FE2C55' }, // More accurate TikTok pink
};

interface PlatformIconProps {
    platform: string;
    className?: string;
    size?: number;
    useBrandColor?: boolean;
    variant?: 'outline' | 'solid';
}

export function PlatformIcon({
    platform,
    className = '',
    size = 16,
    useBrandColor = false,
    variant = 'outline'
}: PlatformIconProps) {
    const p = platform.toLowerCase();
    const style = platformStyles[p];

    if (!style) return <Share2 className={className} size={size} strokeWidth={3} />;

    const Icon = style.icon;
    const isSolid = variant === 'solid';

    return (
        <span
            className={cn(
                "inline-flex items-center justify-center transition-all duration-200",
                isSolid && "rounded-lg p-2 shadow-sm",
                className
            )}
            style={{
                color: isSolid ? '#FFFFFF' : (useBrandColor ? style.color : 'currentColor'),
                backgroundColor: isSolid ? style.color : 'transparent'
            }}
        >
            {style.isSvg ? (
                <Icon size={size} />
            ) : (
                <Icon size={size} strokeWidth={isSolid ? 2.5 : 3} />
            )}
        </span>
    );
}
