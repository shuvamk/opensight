"use client";

import Avatar from "boring-avatars";

export function BrandAvatar({
    name,
    id,
    size = 32,
}: {
    name: string;
    id: string;
    size?: number;
}) {
    return (
        <div
            className="relative rounded-md overflow-hidden shrink-0"
            style={{ width: size, height: size }}
        >
            <div
                className="rounded-md absolute inset-0 ring-[0.6px] ring-inset ring-black/10 dark:ring-white/15 pointer-events-none"
                style={{ width: size, height: size }}
            />
            {/* Override parent (e.g. Button) [&_svg]:size-4 so our SVG keeps the intended size */}
            <div className="size-full [&_svg]:size-full! [&_svg]:block!">
                <Avatar
                    name={id || name}
                    size={size}
                    variant="marble"
                    square
                />
            </div>
        </div>
    );
}