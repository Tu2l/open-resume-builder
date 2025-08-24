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
            <rect x="153" y="170" width="200" height="8" rx="2" fill="#D1D5DB"/>
        </svg>
    ),
    creative: () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <defs>
                <linearGradient id="creativeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#EC4899',stopOpacity:0.3}} />
                    <stop offset="100%" style={{stopColor:'#8B5CF6',stopOpacity:0.3}} />
                </linearGradient>
            </defs>
            <rect width="400" height="560" fill="#FEFEFE"/>
            <rect width="400" height="120" fill="url(#creativeGrad)"/>
            <circle cx="350" cy="60" r="30" fill="rgba(255,255,255,0.2)"/>
            <rect x="40" y="40" width="200" height="25" rx="4" fill="#FFFFFF"/>
            <rect x="40" y="75" width="120" height="12" rx="2" fill="rgba(255,255,255,0.8)"/>
            <rect x="40" y="160" width="100" height="15" rx="4" fill="#EC4899"/>
            <rect x="40" y="185" width="320" height="6" rx="2" fill="#E5E7EB"/>
            <rect x="40" y="200" width="280" height="6" rx="2" fill="#E5E7EB"/>
            <rect x="40" y="240" width="100" height="15" rx="4" fill="#8B5CF6"/>
            <rect x="40" y="265" width="150" height="25" rx="12" fill="#F3F4F6"/>
            <rect x="200" y="265" width="120" height="25" rx="12" fill="#F3F4F6"/>
        </svg>
    ),
    minimalist: () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <rect width="400" height="560" fill="#FFFFFF"/>
            <rect x="50" y="50" width="300" height="30" rx="0" fill="#374151"/>
            <rect x="50" y="90" width="150" height="8" rx="0" fill="#9CA3AF"/>
            <rect x="50" y="110" width="300" height="1" rx="0" fill="#E5E7EB"/>
            <rect x="50" y="140" width="80" height="12" rx="0" fill="#374151"/>
            <rect x="50" y="165" width="300" height="6" rx="0" fill="#D1D5DB"/>
            <rect x="50" y="180" width="250" height="6" rx="0" fill="#D1D5DB"/>
            <rect x="50" y="210" width="80" height="12" rx="0" fill="#374151"/>
            <rect x="50" y="235" width="300" height="6" rx="0" fill="#D1D5DB"/>
            <rect x="50" y="250" width="200" height="6" rx="0" fill="#D1D5DB"/>
            <rect x="50" y="280" width="80" height="12" rx="0" fill="#374151"/>
            <rect x="50" y="305" width="100" height="6" rx="0" fill="#D1D5DB"/>
            <rect x="160" y="305" width="100" height="6" rx="0" fill="#D1D5DB"/>
        </svg>
    ),
    professional: () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <defs>
                <linearGradient id="profGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:'#1E40AF',stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#3B82F6',stopOpacity:1}} />
                </linearGradient>
            </defs>
            <rect width="400" height="560" fill="#F8FAFC"/>
            <rect width="400" height="100" fill="url(#profGrad)"/>
            <rect x="40" y="30" width="180" height="20" rx="4" fill="#FFFFFF"/>
            <rect x="40" y="55" width="120" height="10" rx="2" fill="rgba(255,255,255,0.8)"/>
            <rect x="50" y="130" width="300" height="25" rx="12" fill="#EBF4FF"/>
            <rect x="50" y="175" width="90" height="12" rx="4" fill="#1E40AF"/>
            <rect x="50" y="200" width="300" height="6" rx="2" fill="#CBD5E1"/>
            <rect x="50" y="215" width="250" height="6" rx="2" fill="#CBD5E1"/>
            <rect x="50" y="245" width="90" height="12" rx="4" fill="#1E40AF"/>
            <rect x="50" y="270" width="140" height="20" rx="10" fill="#DBEAFE"/>
            <rect x="200" y="270" width="100" height="20" rx="10" fill="#DBEAFE"/>
        </svg>
    ),
    executive: () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <rect width="400" height="560" fill="#F9FAFB"/>
            <rect x="40" y="40" width="320" height="35" rx="0" fill="#1F2937"/>
            <rect x="50" y="50" width="2" height="15" rx="1" fill="#D1D5DB"/>
            <rect x="60" y="50" width="150" height="15" rx="0" fill="#D1D5DB"/>
            <rect x="40" y="100" width="100" height="12" rx="0" fill="#6B7280"/>
            <rect x="40" y="125" width="320" height="8" rx="0" fill="#E5E7EB"/>
            <rect x="40" y="140" width="280" height="8" rx="0" fill="#E5E7EB"/>
            <rect x="40" y="155" width="200" height="8" rx="0" fill="#E5E7EB"/>
            <rect x="40" y="185" width="100" height="12" rx="0" fill="#6B7280"/>
            <rect x="40" y="210" width="320" height="8" rx="0" fill="#E5E7EB"/>
            <rect x="40" y="225" width="250" height="8" rx="0" fill="#E5E7EB"/>
            <rect x="40" y="255" width="100" height="12" rx="0" fill="#6B7280"/>
            <rect x="40" y="280" width="150" height="15" rx="0" fill="#F3F4F6"/>
            <rect x="200" y="280" width="120" height="15" rx="0" fill="#F3F4F6"/>
        </svg>
    ),
    technical: () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <rect width="400" height="560" fill="#0F172A"/>
            <rect x="20" y="20" width="360" height="30" rx="4" fill="#1E293B"/>
            <rect x="30" y="30" width="8" height="8" rx="1" fill="#10B981"/>
            <rect x="45" y="30" width="150" height="8" rx="1" fill="#F1F5F9"/>
            <rect x="20" y="70" width="100" height="10" rx="2" fill="#10B981"/>
            <rect x="20" y="90" width="360" height="6" rx="1" fill="#475569"/>
            <rect x="20" y="105" width="300" height="6" rx="1" fill="#475569"/>
            <rect x="20" y="135" width="100" height="10" rx="2" fill="#10B981"/>
            <rect x="20" y="155" width="80" height="15" rx="2" fill="#1E293B"/>
            <rect x="110" y="155" width="80" height="15" rx="2" fill="#1E293B"/>
            <rect x="200" y="155" width="80" height="15" rx="2" fill="#1E293B"/>
            <rect x="20" y="185" width="100" height="10" rx="2" fill="#10B981"/>
            <rect x="20" y="205" width="360" height="6" rx="1" fill="#475569"/>
            <rect x="20" y="220" width="250" height="6" rx="1" fill="#475569"/>
        </svg>
    ),
    'two-column': () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <rect width="400" height="560" fill="#FEFEFE"/>
            <rect width="140" height="560" fill="#F1F5F9"/>
            <rect x="20" y="30" width="100" height="20" rx="4" fill="#64748B"/>
            <rect x="20" y="60" width="80" height="8" rx="2" fill="#94A3B8"/>
            <rect x="20" y="85" width="60" height="12" rx="4" fill="#64748B"/>
            <rect x="20" y="105" width="100" height="6" rx="2" fill="#CBD5E1"/>
            <rect x="20" y="120" width="80" height="6" rx="2" fill="#CBD5E1"/>
            <rect x="20" y="145" width="60" height="12" rx="4" fill="#64748B"/>
            <rect x="20" y="165" width="100" height="6" rx="2" fill="#CBD5E1"/>
            <rect x="160" y="30" width="200" height="25" rx="4" fill="#374151"/>
            <rect x="160" y="65" width="120" height="8" rx="2" fill="#6B7280"/>
            <rect x="160" y="85" width="200" height="6" rx="2" fill="#9CA3AF"/>
            <rect x="160" y="100" width="180" height="6" rx="2" fill="#9CA3AF"/>
            <rect x="160" y="125" width="80" height="12" rx="4" fill="#374151"/>
            <rect x="160" y="145" width="200" height="6" rx="2" fill="#9CA3AF"/>
            <rect x="160" y="160" width="150" height="6" rx="2" fill="#9CA3AF"/>
        </svg>
    ),
    elegant: () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <defs>
                <linearGradient id="elegantGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#F3E8FF',stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#E0E7FF',stopOpacity:1}} />
                </linearGradient>
            </defs>
            <rect width="400" height="560" fill="url(#elegantGrad)"/>
            <circle cx="80" cy="80" r="40" fill="rgba(139,92,246,0.2)"/>
            <rect x="50" y="140" width="300" height="25" rx="0" fill="#7C3AED"/>
            <rect x="50" y="175" width="150" height="8" rx="0" fill="#A78BFA"/>
            <rect x="50" y="200" width="300" height="1" rx="0" fill="#C4B5FD"/>
            <rect x="50" y="225" width="100" height="12" rx="0" fill="#5B21B6"/>
            <rect x="50" y="245" width="300" height="6" rx="0" fill="#DDD6FE"/>
            <rect x="50" y="260" width="250" height="6" rx="0" fill="#DDD6FE"/>
            <rect x="50" y="285" width="100" height="12" rx="0" fill="#5B21B6"/>
            <rect x="50" y="305" width="120" height="15" rx="7" fill="#F3E8FF"/>
            <rect x="180" y="305" width="100" height="15" rx="7" fill="#F3E8FF"/>
            <circle cx="350" cy="450" r="20" fill="rgba(139,92,246,0.1)"/>
        </svg>
    ),
    compact: () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <rect width="400" height="560" fill="#FFFFFF"/>
            <rect x="30" y="20" width="340" height="20" rx="0" fill="#2C3E50"/>
            <rect x="30" y="45" width="120" height="6" rx="0" fill="#7F8C8D"/>
            <rect x="30" y="60" width="340" height="1" rx="0" fill="#BDC3C7"/>
            <rect x="30" y="75" width="60" height="8" rx="0" fill="#2C3E50"/>
            <rect x="30" y="90" width="340" height="4" rx="0" fill="#ECF0F1"/>
            <rect x="30" y="100" width="300" height="4" rx="0" fill="#ECF0F1"/>
            <rect x="30" y="110" width="250" height="4" rx="0" fill="#ECF0F1"/>
            <rect x="30" y="125" width="60" height="8" rx="0" fill="#2C3E50"/>
            <rect x="30" y="140" width="340" height="4" rx="0" fill="#ECF0F1"/>
            <rect x="30" y="150" width="280" height="4" rx="0" fill="#ECF0F1"/>
            <rect x="30" y="165" width="60" height="8" rx="0" fill="#2C3E50"/>
            <rect x="30" y="180" width="160" height="4" rx="0" fill="#ECF0F1"/>
            <rect x="200" y="180" width="140" height="4" rx="0" fill="#ECF0F1"/>
            <rect x="30" y="200" width="100" height="15" rx="0" fill="#F8F9FA"/>
            <rect x="140" y="200" width="100" height="15" rx="0" fill="#F8F9FA"/>
            <rect x="250" y="200" width="90" height="15" rx="0" fill="#F8F9FA"/>
        </svg>
    ),
    'modern-executive': () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <defs>
                <linearGradient id="modernExecGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#1A365D',stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#2C5AA0',stopOpacity:1}} />
                </linearGradient>
            </defs>
            <rect width="400" height="560" fill="#FFFFFF"/>
            <rect width="400" height="140" fill="url(#modernExecGrad)"/>
            <circle cx="320" cy="70" r="25" fill="rgba(255,255,255,0.1)"/>
            <circle cx="100" cy="120" r="15" fill="rgba(255,255,255,0.05)"/>
            <rect x="40" y="40" width="200" height="25" rx="0" fill="#FFFFFF"/>
            <rect x="40" y="75" width="120" height="10" rx="0" fill="rgba(255,255,255,0.9)"/>
            <rect x="40" y="100" width="200" height="8" rx="0" fill="rgba(255,255,255,0.8)"/>
            <rect x="40" y="170" width="320" height="25" rx="12" fill="#F8FAFC"/>
            <rect x="40" y="210" width="80" height="12" rx="0" fill="#1A365D"/>
            <rect x="40" y="235" width="320" height="6" rx="0" fill="#E2E8F0"/>
            <rect x="40" y="250" width="280" height="6" rx="0" fill="#E2E8F0"/>
            <rect x="40" y="275" width="80" height="12" rx="0" fill="#1A365D"/>
            <rect x="40" y="300" width="150" height="20" rx="10" fill="#EDF2F7"/>
            <rect x="200" y="300" width="120" height="20" rx="10" fill="#EDF2F7"/>
        </svg>
    ),
    academic: () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <rect width="400" height="560" fill="#FFFFFF"/>
            <rect x="50" y="40" width="300" height="30" rx="0" fill="#1A365D"/>
            <rect x="50" y="80" width="150" height="8" rx="0" fill="#2C5AA0"/>
            <rect x="50" y="100" width="300" height="2" rx="0" fill="#2C5AA0"/>
            <rect x="50" y="120" width="100" height="10" rx="0" fill="#1A365D"/>
            <rect x="50" y="140" width="300" height="6" rx="0" fill="#4A5568"/>
            <rect x="50" y="155" width="250" height="6" rx="0" fill="#4A5568"/>
            <rect x="50" y="175" width="100" height="10" rx="0" fill="#1A365D"/>
            <circle cx="60" cy="195" r="6" fill="#2C5AA0"/>
            <rect x="75" y="190" width="200" height="5" rx="0" fill="#718096"/>
            <circle cx="60" cy="210" r="6" fill="#2C5AA0"/>
            <rect x="75" y="205" width="180" height="5" rx="0" fill="#718096"/>
            <rect x="50" y="235" width="100" height="10" rx="0" fill="#1A365D"/>
            <rect x="50" y="255" width="300" height="6" rx="0" fill="#4A5568"/>
            <rect x="50" y="270" width="200" height="6" rx="0" fill="#4A5568"/>
            <rect x="50" y="290" width="150" height="15" rx="0" fill="#F8FAFC"/>
            <rect x="210" y="290" width="140" height="15" rx="0" fill="#F8FAFC"/>
        </svg>
    ),
    sales: () => (
        <svg width="100%" height="100%" viewBox="0 0 400 560" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
            <defs>
                <linearGradient id="salesGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{stopColor:'#059669',stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#10B981',stopOpacity:1}} />
                </linearGradient>
            </defs>
            <rect width="400" height="560" fill="#FFFFFF"/>
            <rect width="400" height="100" fill="url(#salesGrad)"/>
            <circle cx="330" cy="50" r="20" fill="rgba(255,255,255,0.1)"/>
            <rect x="40" y="30" width="180" height="20" rx="0" fill="#FFFFFF"/>
            <rect x="40" y="55" width="120" height="10" rx="0" fill="rgba(255,255,255,0.9)"/>
            <rect x="50" y="130" width="80" height="25" rx="4" fill="#F0F9FF"/>
            <rect x="140" y="130" width="80" height="25" rx="4" fill="#F0F9FF"/>
            <rect x="230" y="130" width="80" height="25" rx="4" fill="#F0F9FF"/>
            <rect x="320" y="130" width="80" height="25" rx="4" fill="#F0F9FF"/>
            <rect x="55" y="140" width="25" height="8" rx="0" fill="#059669"/>
            <rect x="55" y="150" width="15" height="4" rx="0" fill="#6B7280"/>
            <rect x="50" y="180" width="80" height="12" rx="0" fill="#059669"/>
            <rect x="50" y="200" width="300" height="6" rx="0" fill="#E5E7EB"/>
            <rect x="50" y="215" width="250" height="6" rx="0" fill="#E5E7EB"/>
            <rect x="50" y="240" width="80" height="12" rx="0" fill="#059669"/>
            <rect x="50" y="260" width="150" height="20" rx="10" fill="#F3F4F6"/>
            <rect x="210" y="260" width="120" height="20" rx="10" fill="#F3F4F6"/>
        </svg>
    )
};

/**
 * Component for rendering a template thumbnail
 * @param templateId The ID of the template to render
 */
export function TemplateThumbnail({ templateId }: { templateId: string }) {
    const ThumbnailComponent = thumbnailComponents[templateId];
    
    if (!ThumbnailComponent) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                Template not found
            </div>
        );
    }
    
    return <ThumbnailComponent />;
}
