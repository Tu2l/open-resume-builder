'use client';

import { getBaseUrl } from '@/lib/utils';
/**
 * @fileoverview Dynamic thumbnail component for resume templates.
 * Loads template thumbnails dynamically from JSON configuration and SVG files.
 */

import React, { useEffect, useState } from 'react';

interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  thumbnail: string;
  features: string[];
}

interface TemplatesConfig {
  templates: TemplateConfig[];
}

/**
 * Component for rendering a template thumbnail
 * @param templateId The ID of the template to render
 */
export default function TemplateThumbnail({ templateId }: { templateId: string }) {
    const [thumbnailSrc, setThumbnailSrc] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        async function loadThumbnail() {
            try {
                setIsLoading(true);
                setError('');

                const url =`${getBaseUrl()}/templates/templates.json`;
                // Load template configuration
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to load templates configuration: ${response.statusText}`);
                }

                const config: TemplatesConfig = await response.json();
                const template = config.templates.find(t => t.id === templateId);

                if (!template) {
                    throw new Error(`Template with ID "${templateId}" not found in configuration`);
                }

                if (!template.thumbnail) {
                    throw new Error(`No thumbnail specified for template "${templateId}"`);
                }

                // Construct thumbnail path
                const thumbnailPath = `/templates/thumbnails/${template.thumbnail}`;
                setThumbnailSrc(thumbnailPath);
            } catch (err) {
                console.error('Error loading thumbnail:', err);
                setError(err instanceof Error ? err.message : 'Failed to load thumbnail');
            } finally {
                setIsLoading(false);
            }
        }

        if (templateId) {
            loadThumbnail();
        }
    }, [templateId]);

    if (isLoading) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    <span className="text-sm">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500">
                <div className="text-center p-4">
                    <div className="text-lg mb-2">⚠️</div>
                    <div className="text-sm">Thumbnail not available</div>
                    <div className="text-xs text-gray-400 mt-1">{templateId}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 w-full h-full">
            <img
                src={thumbnailSrc}
                alt={`${templateId} template thumbnail`}
                className="absolute inset-0 w-full h-full object-cover"
                onError={() => setError('Failed to load thumbnail image')}
            />
        </div>
    );
}
