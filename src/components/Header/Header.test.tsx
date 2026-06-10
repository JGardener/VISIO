import { render, screen } from '@testing-library/react';
import Header, { type AppStatus } from './Header';

const defaultProps = {
  hasScene: false,
  promptSlug: 'test',
  canvasRef: { current: null },
  onHowItWorks: () => {},
  onOpenLibrary: () => {},
  libraryOpen: false,
  libraryCount: 0,
};

function renderHeader(status: AppStatus, overrides: Partial<typeof defaultProps> = {}) {
  return render(<Header {...defaultProps} {...overrides} status={status} />);
}

describe('How It Works button', () => {
  it('label has no raw ? punctuation', () => {
    renderHeader('idle');
    const btn = screen.getByRole('button', { name: /how it works/i });
    expect(btn.textContent).not.toMatch(/\?/);
  });
});

describe('Header status', () => {
  it('has title "Idle" when status is idle', () => {
    renderHeader('idle');
    expect(document.querySelector('[title="Idle"]')).toBeInTheDocument();
  });

  it('has title "Generating…" when status is streaming', () => {
    renderHeader('streaming');
    expect(document.querySelector('[title="Generating…"]')).toBeInTheDocument();
  });

  it('has title "Ready" when status is ready', () => {
    renderHeader('ready');
    expect(document.querySelector('[title="Ready"]')).toBeInTheDocument();
  });

  it('has title "Error" when status is error', () => {
    renderHeader('error');
    expect(document.querySelector('[title="Error"]')).toBeInTheDocument();
  });

  it('announces status via a live region', () => {
    renderHeader('streaming');
    expect(screen.getByRole('status')).toHaveTextContent('Generating…');
  });
});

describe('Header actions', () => {
  it('Export PNG is disabled without a scene', () => {
    renderHeader('idle');
    expect(screen.getByRole('button', { name: /export png/i })).toBeDisabled();
  });

  it('Export PNG is enabled with a scene', () => {
    renderHeader('ready', { hasScene: true });
    expect(screen.getByRole('button', { name: /export png/i })).toBeEnabled();
  });

  it('Library button shows the entry count', () => {
    renderHeader('ready', { libraryCount: 3 });
    expect(screen.getByRole('button', { name: /library/i })).toHaveTextContent('3');
  });

  it('Library button exposes expanded state', () => {
    renderHeader('ready', { libraryOpen: true });
    expect(screen.getByRole('button', { name: /library/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });
});
