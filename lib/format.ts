export function formatPrice(price: number, purpose?: string): string {
  if (purpose === 'For Rent' || purpose === 'Lease') {
    return `₹${price.toLocaleString('en-IN')}/mo`;
  }
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(0)} Lakhs`;
  }
  return `₹${price.toLocaleString('en-IN')}`;
}

export function formatArea(area: number): string {
  return `${area.toLocaleString('en-IN')} Sq.Ft.`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return formatDate(dateStr);
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'Active':
      return 'bg-success/10 text-success border-success/20';
    case 'Draft':
      return 'bg-muted text-muted-foreground border-border';
    case 'Sold':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'Rented':
      return 'bg-accent/10 text-accent-foreground border-accent/20';
    case 'Archived':
      return 'bg-muted text-muted-foreground border-border';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
}
