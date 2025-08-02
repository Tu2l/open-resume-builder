'use client';

/**
 * @fileoverview This file contains the SVG thumbnail components for the resume templates.
 * These are separated into their own component to keep the main page file clean and to
 * ensure JSX syntax is handled correctly within a .tsx file.
 */

import React from 'react';

/**
 * A map of template IDs to their respective SVG thumbnail components.
 */
const thumbnailComponents: Record<string, React.FC> = {
    classic: () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <rect width="400" height="560" fill="#F3F4F6"/>
            <rect x="40" y="40" width="320" height="40" rx="4" fill="#D1D5DB"/>
            <rect x="100" y="90" width="200" height="10" rx="2" fill="#D1D5DB"/>
            <rect x="40" y="140" width="120" height="20" rx="4" fill="#9CA3AF"/>
            <rect x="40" y="170" width="320" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="40" y="185" width="280" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="40" y="225" width="120" height="20" rx="4" fill="#9CA3AF"/>
            <rect x="40" y="255" width="320" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="40" y="270" width="320" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="40" y="285" width="200" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="40" y="325" width="120" height="20" rx="4" fill="#9CA3AF"/>
            <rect x="40" y="355" width="320" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="40" y="370" width="250" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="40" y="410" width="120" height="20" rx="4" fill="#9CA3AF"/>
            <rect x="40" y="440" width="80" height="20" rx="10" fill="#D1D5DB"/>
            <rect x="130" y="440" width="80" height="20" rx="10" fill="#D1D5DB"/>
            <rect x="220" y="440" width="80" height="20" rx="10" fill="#D1D5DB"/>
        </svg>
    ),
    modern: () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <rect width="400" height="560" fill="#F9FAFB"/>
            <rect width="133" height="560" fill="#E5E7EB"/>
            <rect x="20" y="40" width="93" height="30" rx="4" fill="#9CA3AF"/>
            <rect x="20" y="90" width="60" height="15" rx="4" fill="#9CA3AF"/>
            <rect x="20" y="115" width="93" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="20" y="130" width="80" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="20" y="165" width="60" height="15" rx="4" fill="#9CA3AF"/>
            <rect x="20" y="190" width="93" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="20" y="205" width="70" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="153" y="40" width="120" height="20" rx="4" fill="#9CA3AF"/>
            <rect x="153" y="70" width="227" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="153" y="85" width="180" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="153" y="125" width="120" height="20" rx="4" fill="#9CA3AF"/>
            <rect x="153" y="155" width="227" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="153" y="170" width="227" height="8" rx="2" fill="#D1D5DB"/>
            <rect x="153" y="185" width="150" height="8" rx="2" fill="#D1D5DB"/>
        </svg>
    ),
    creative: () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <rect width="400" height="560" fill="#F3F4F6"/>
            <rect y="0" width="400" height="10" fill="#A78BFA"/>
            <rect x="40" y="50" width="320" height="40" rx="4" fill="#A78BFA"/>
            <rect x="100" y="100" width="200" height="8" rx="2" fill="#C4B5FD"/>
            <rect x="40" y="150" width="120" height="20" rx="4" fill="#8B5CF6"/>
            <rect x="40" y="180" width="320" height="6" rx="2" fill="#DDD6FE"/>
            <rect x="40" y="192" width="280" height="6" rx="2" fill="#DDD6FE"/>
            <rect x="40" y="232" width="120" height="20" rx="4" fill="#8B5CF6"/>
            <rect x="40" y="262" width="320" height="6" rx="2" fill="#DDD6FE"/>
            <rect x="40" y="274" width="320" height="6" rx="2" fill="#DDD6FE"/>
            <rect x="40" y="286" width="200" height="6" rx="2" fill="#DDD6FE"/>
            <rect x="40" y="326" width="120" height="20" rx="4" fill="#8B5CF6"/>
            <rect x="40" y="356" width="80" height="20" rx="10" fill="#C4B5FD"/>
            <rect x="130" y="356" width="80" height="20" rx="10" fill="#C4B5FD"/>
        </svg>
    ),
};


interface TemplateThumbnailProps {
    templateId: 'classic' | 'modern' | 'creative';
}

/**
 * Renders the appropriate SVG thumbnail based on the provided template ID.
 * @param {TemplateThumbnailProps} props - The component props.
 * @returns {React.ReactElement | null} The rendered SVG component or null if the ID is invalid.
 */
export const TemplateThumbnail: React.FC<TemplateThumbnailProps> = ({ templateId }) => {
    const ThumbnailComponent = thumbnailComponents[templateId];
    return ThumbnailComponent ? <ThumbnailComponent /> : null;
};
