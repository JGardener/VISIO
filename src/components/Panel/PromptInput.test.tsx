import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PromptInput from './PromptInput';

const noop = () => {};

const baseProps = {
  value: '',
  onChange: noop,
  onGenerate: noop,
  onRefine: noop,
  onChipSelect: noop,
  loading: false,
  hasScene: false,
};

describe('PromptInput', () => {
  it('chips are disabled while loading', () => {
    render(<PromptInput {...baseProps} loading={true} />);

    expect(screen.getByRole('button', { name: /nebula/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /solar system/i })).toBeDisabled();
  });

  it('chips are hidden once the user has typed something', () => {
    render(<PromptInput {...baseProps} value="a quiet forest" />);

    expect(screen.queryByRole('button', { name: /nebula/i })).not.toBeInTheDocument();
  });

  it('clicking a suggestion chip fires onChipSelect with that chip text', async () => {
    const onChipSelect = vi.fn();
    render(<PromptInput {...baseProps} onChipSelect={onChipSelect} />);

    await userEvent.click(screen.getByRole('button', { name: /nebula/i }));

    expect(onChipSelect).toHaveBeenCalledOnce();
    expect(onChipSelect).toHaveBeenCalledWith(
      'A nebula with swirling purple and blue particles',
    );
  });

  it('shows a Generate submit button and no mode toggle when no scene exists', () => {
    render(<PromptInput {...baseProps} value="test" />);

    expect(screen.getByRole('button', { name: /generate scene/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /refine this scene/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /start new/i })).not.toBeInTheDocument();
  });

  it('shows the mode toggle and a Refine submit button when a scene is active', () => {
    render(<PromptInput {...baseProps} value="test" hasScene={true} />);

    expect(screen.getByRole('button', { name: /refine this scene/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start new/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /refine scene/i })).toBeInTheDocument();
  });

  it('submit and mode buttons are disabled while loading when a scene is active', () => {
    render(<PromptInput {...baseProps} value="test" hasScene={true} loading={true} />);

    expect(screen.getByRole('button', { name: /refine scene/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /start new/i })).toBeDisabled();
  });

  it('submitting in refine mode fires onRefine', async () => {
    const onRefine = vi.fn();
    render(<PromptInput {...baseProps} value="add a comet" hasScene={true} onRefine={onRefine} />);

    await userEvent.click(screen.getByRole('button', { name: /refine scene/i }));

    expect(onRefine).toHaveBeenCalledOnce();
  });

  it('switching to Start new makes submit fire onGenerate instead', async () => {
    const onGenerate = vi.fn();
    const onRefine = vi.fn();
    render(
      <PromptInput
        {...baseProps}
        value="a coral reef"
        hasScene={true}
        onGenerate={onGenerate}
        onRefine={onRefine}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /start new/i }));
    await userEvent.click(screen.getByRole('button', { name: /generate scene/i }));

    expect(onGenerate).toHaveBeenCalledOnce();
    expect(onRefine).not.toHaveBeenCalled();
  });

  it('refine chips fill the input via onChange rather than generating immediately', async () => {
    const onChange = vi.fn();
    const onChipSelect = vi.fn();
    render(
      <PromptInput
        {...baseProps}
        hasScene={true}
        onChange={onChange}
        onChipSelect={onChipSelect}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /add a comet/i }));

    expect(onChange).toHaveBeenCalledWith('Add a comet streaking across');
    expect(onChipSelect).not.toHaveBeenCalled();
  });

  it('placeholder reflects refinement context when a scene is active', () => {
    render(<PromptInput {...baseProps} hasScene={true} />);

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      expect.stringContaining('change'),
    );
  });

  it('pressing Enter submits the prompt', async () => {
    const onGenerate = vi.fn();
    render(<PromptInput {...baseProps} value="a storm" onGenerate={onGenerate} />);

    await userEvent.type(screen.getByRole('textbox'), '{Enter}');

    expect(onGenerate).toHaveBeenCalledOnce();
  });
});
