class DateService {
    public formatDate(date: string) {
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    }

    public formatTweetContent(content: string): string {
        // Remplace les hashtags avec des spans stylisés
        let formattedContent = content.replace(
            /#(\w+)/g,
            '<span class="text-blue-500 hover:underline cursor-pointer">#$1</span>'
        );

        // Remplace les mentions avec des spans stylisés
        formattedContent = formattedContent.replace(
            /@(\w+)/g,
            '<span class="text-blue-500 hover:underline cursor-pointer">@$1</span>'
        );

        // Remplace les URLs avec des liens stylisés
        formattedContent = formattedContent.replace(
            /(https?:\/\/[^\s]+)/g,
            '<a href="$1" class="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
        );

        return formattedContent;
    }

    public formatTime(dateString: string): string {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays} j`;
        if (diffHours > 0) return `${diffHours} h`;
        if (diffMins > 0) return `${diffMins} min`;
        return `${diffSecs} s`;
    }
}

const dateService = new DateService();
export default dateService;