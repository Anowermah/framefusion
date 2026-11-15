import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { ArrowLeft } from 'lucide-react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-50/50 via-white to-[#F8F9FC] py-8 sm:py-12 px-4 sm:px-6">
            <div className="mb-6 flex flex-col items-center">
                <Link href="/" className="mb-2">
                    <ApplicationLogo size="lg" showTagline={true} />
                </Link>
            </div>

            <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-card p-6 sm:p-8 space-y-6">
                {children}
            </div>

            <div className="mt-6 text-center">
                <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-brand-600 transition-colors">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Return to Home</span>
                </Link>
            </div>
        </div>
    );
}
