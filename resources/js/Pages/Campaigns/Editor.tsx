import React from 'react';
import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import PhotoEditor from '@/Components/PhotoEditor';

interface EditorPageProps {
    campaign: any;
}

export default function Editor({ campaign }: EditorPageProps) {
    return (
        <MainLayout>
            <Head title={`Photo Studio | ${campaign.title}`} />
            <PhotoEditor campaign={campaign} />
        </MainLayout>
    );
}

