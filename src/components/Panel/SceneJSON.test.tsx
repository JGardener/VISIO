import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SceneJSON from './SceneJSON';
import type { SceneDefinition } from '@/types';

const mockScene: SceneDefinition = {
  background: { color: '#000000' },
  elements: [],
};

describe('SceneJSON', () => {
  it('renders a "Scene JSON" toggle button', () => {
    render(<SceneJSON scene={mockScene} />);
    expect(screen.getByRole('button', { name: /scene json/i })).toBeInTheDocument();
  });

  it('renders when only a streamBuffer is provided (no scene yet)', () => {
    render(<SceneJSON scene={null} streamBuffer='{"background":' />);
    expect(screen.getByRole('button', { name: /scene json/i })).toBeInTheDocument();
  });

  it('shows raw stream text when expanded during streaming', async () => {
    render(<SceneJSON scene={null} streamBuffer='{"background":{"color":"#000"' />);
    await userEvent.click(screen.getByRole('button', { name: /scene json/i }));
    expect(screen.getByText(/\{"background":/)).toBeInTheDocument();
  });

  it('hides the copy button while streaming', async () => {
    render(<SceneJSON scene={null} streamBuffer='partial json' />);
    await userEvent.click(screen.getByRole('button', { name: /scene json/i }));
    expect(screen.queryByRole('button', { name: /copy/i })).not.toBeInTheDocument();
  });

  it('is collapsed by default — JSON content not rendered', () => {
    render(<SceneJSON scene={mockScene} />);
    expect(screen.queryByRole('button', { name: /copy/i })).not.toBeInTheDocument();
  });

  it('reveals JSON content when the toggle is clicked', async () => {
    render(<SceneJSON scene={mockScene} />);
    await userEvent.click(screen.getByRole('button', { name: /scene json/i }));
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
  });

  it('hides JSON content when the toggle is clicked a second time', async () => {
    render(<SceneJSON scene={mockScene} />);
    const toggle = screen.getByRole('button', { name: /scene json/i });
    await userEvent.click(toggle);
    await userEvent.click(toggle);
    expect(screen.queryByRole('button', { name: /copy/i })).not.toBeInTheDocument();
  });
});
