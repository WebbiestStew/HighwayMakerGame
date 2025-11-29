import React from 'react'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
    id: string
    type: NotificationType
    message: string
    duration?: number
}

interface NotificationToastProps {
    notification: Notification
    onClose: (id: string) => void
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(() => {
            onClose(notification.id)
        }, notification.duration || 3000)

        return () => clearTimeout(timer)
    }, [notification, onClose])

    const colors = {
        success: 'from-green-600 to-emerald-600 border-green-400',
        error: 'from-red-600 to-rose-600 border-red-400',
        warning: 'from-yellow-600 to-orange-600 border-yellow-400',
        info: 'from-blue-600 to-indigo-600 border-blue-400'
    }

    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }

    return (
        <div className={`bg-gradient-to-r ${colors[notification.type]} rounded-lg p-4 shadow-2xl border-2 min-w-[300px] animate-slide-in-right`}>
            <div className="flex items-center gap-3">
                <div className="text-2xl">{icons[notification.type]}</div>
                <div className="flex-1 text-white font-medium">{notification.message}</div>
                <button
                    onClick={() => onClose(notification.id)}
                    className="text-white/70 hover:text-white transition-colors text-xl"
                >
                    ✕
                </button>
            </div>
        </div>
    )
}

export const NotificationContainer: React.FC<{ notifications: Notification[], onClose: (id: string) => void }> = ({ notifications, onClose }) => {
    return (
        <div className="fixed top-24 right-6 z-50 space-y-3">
            {notifications.map(notification => (
                <NotificationToast
                    key={notification.id}
                    notification={notification}
                    onClose={onClose}
                />
            ))}
        </div>
    )
}
