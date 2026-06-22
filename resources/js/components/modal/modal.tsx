import React, {useEffect, useRef} from 'react';

export interface ModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    modalRef?: React.RefObject<HTMLDivElement>;
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
    className?: string;
}

export default function Modal({visible, onClose, children, modalRef, size = 'md', className = ''}: ModalProps) {
    const fallBackRef = useRef(null);
    modalRef = modalRef || fallBackRef;

    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    // When modal becomes visible, there is often a user click that caused it.
    // Ignore outside clicks for a short window after opening so that the
    // original click doesn't immediately close the modal (avoids open/close
    // flash and potential render loops).
    const ignoreOutsideClickRef = useRef(false);

    // Store original body overflow style to restore it later
    const originalBodyOverflowRef = useRef('');

    useEffect(() => {
        const handleClickOutside = (e) => {
            // If we are temporarily ignoring outside clicks just after open,
            // do nothing.
            if (ignoreOutsideClickRef.current) {
                return;
            }

            if (
                modalRef.current &&
                !modalRef.current.contains(e.target) &&
                !e.target.closest('[data-dropdown-root]') && // Ignore clicks on dropdowns
                !e.target.closest('[data-modal-safe="true"]') // Ignore clicks on elements marked as modal-safe
            ) {
                onCloseRef.current();
            }
        };

        if (visible) {
            // Store original overflow style
            originalBodyOverflowRef.current = document.body.style.overflow;
            // Hide scrollbar on body
            document.body.style.overflow = 'hidden';
            // Also prevent scrolling on html element for better cross-browser support
            document.documentElement.style.overflow = 'hidden';

            // Temporarily ignore outside clicks for a short time to avoid the
            // opening click closing the modal immediately.
            ignoreOutsideClickRef.current = true;
            const ignoreTimeout = setTimeout(() => {
                ignoreOutsideClickRef.current = false;
            }, 150);

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                clearTimeout(ignoreTimeout);
                // Restore original overflow styles
                document.body.style.overflow = originalBodyOverflowRef.current;
                document.documentElement.style.overflow = '';
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }

        return () => {
            // Clean up if modal becomes invisible
            document.body.style.overflow = originalBodyOverflowRef.current;
            document.documentElement.style.overflow = '';
        };
    }, [modalRef, visible]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onCloseRef.current();
            }
        };

        if (visible) {
            document.addEventListener('keydown', handleKeyDown);
        }

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [visible]);

    const sizeMap = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
    };

    const modalSizeClass = sizeMap[size] || sizeMap['md'];

    return (
        <div
            className={`fixed inset-0 z-100 flex items-center justify-center transition-all duration-200 ease-in-out ${
                visible
                    ? 'opacity-100 bg-black/50 backdrop-blur-sm pointer-events-auto'
                    : 'opacity-0 bg-transparent backdrop-blur-0 pointer-events-none'
            }`}
        >
            <div
                ref={modalRef}
                className={`bg-white dark:bg-gray-950 rounded-2xl overflow-hidden w-full ${modalSizeClass} mx-4 transform transition-all duration-300 ease-in-out ${
                    visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                } ${className}`}
            >
                {/* Move overflow-y-auto here */}
                <div className="max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <div className="p-6">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
