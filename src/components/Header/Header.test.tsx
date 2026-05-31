import { render, screen } from '@testing-library/react';
import Header, { type AppStatus } from './Header';

const defaultProps = {
  hasScene: false,
  promptSlug: 'test',
  canvasRef: { current: null },
  onHowItWorks: () => {},
};

function renderHeader(status: AppStatus) {
  return render(<Header {...defaultProps} status={status} />);
}

describe('How It Works button', () => {
  it('label has no raw ? punctuation', () => {
    renderHeader('idle');
    const btn = screen.getByRole('button', { name: /how it works/i });
    expect(btn.textContent).not.toMatch(/\?/);
  });
});

describe('Header status dot', () => {
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
});
