export const formatFileSize = (bytes) => {
        if (!bytes) return '0 B'
        const k = 1024
        const sizes = ['B', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
export const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }


export const getUserInitials = (username) => {
        if (!username) return '?'
        return username.charAt(0).toUpperCase()
    }

export const getRandomColor = (username) => {
        if (!username) return '#4299e1'

        const colors = [
            '#4299e1', // blue
            '#48bb78', // green
            '#ed8936', // orange
            '#9f7aea', // purple
            '#f56565', // red
            '#0bc5ea', // cyan
            '#38b2ac', // teal
        ]

        const index = username.length % colors.length
        return colors[index]
    }

export const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop()?.toLowerCase()
        const iconMap = {
            'pdf': '📕',
            'doc': '📄',
            'docx': '📄',
            'txt': '📝',
            'zip': '📦',
            'rar': '📦',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'png': '🖼️',
            'gif': '🖼️',
            'mp4': '🎬',
            'avi': '🎬',
            'mov': '🎬',
            'mp3': '🎵',
            'wav': '🎵',
            'xls': '📊',
            'xlsx': '📊',
            'ppt': '📽️',
            'pptx': '📽️',
        }
        return iconMap[extension] || '📄'
    }

export const formatFileName = (fileName) => {
        if (fileName.length <= 15) return fileName
        return fileName.substring(0, 12) + '...'
    }