import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PromptInput from './PromptInput';

const noop = () => {};

describe('PromptInput', () => {
  it('chips are disabled while loading', () => {
    render(
      <PromptInput
        value=""
        onChange={noop}
        onGenerate={noop}
        onRefine={noop}
        onChipSelect={noop}
        loading={true}
        hasScene={false}
      />,
    );

    expect(screen.getByRole('button', { name: /nebula/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /solar system/i })).toBeDisabled();
  });

  it('clicking a chip fires onChipSelect with that chip text', async () => {
    const onChipSelect = vi.fn();
    render(
      <PromptInput
        value=""
        onChange={noop}
        onGenerate={noop}
        onRefine={noop}
        onChipSelect={onChipSelect}
        loading={false}
        hasScene={false}
      />,
    );

    const chips = screen.getAllByRole('button', { name: /nebula/i });
    await userEvent.click(chips[0]);

    expect(onChipSelect).toHaveBeenCalledOnce();
    expect(onChipSelect).toHaveBeenCalledWith(
      'A nebula with swirling purple and blue particles',
    );
  });

  it('shows only Generate Scene button when no active scene', () => {
    render(
      <PromptInput
        value="test"
        onChange={noop}
        onGenerate={noop}
        onRefine={noop}
        onChipSelect={noop}
        loading={false}
        hasScene={false}
      />,
    );

    expect(screen.getByRole('button', { name: /generate scene/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /refine scene/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /new scene/i })).not.toBeInTheDocument();
  });

  it('shows Refine Scene and New Scene buttons when a scene is active', () => {
    render(
      <PromptInput
        value="test"
        onChange={noop}
        onGenerate={noop}
        onRefine={noop}
        onChipSelect={noop}
        loading={false}
        hasScene={true}
      />,
    );

    expect(screen.getByRole('button', { name: /refine scene/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new scene/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /generate scene/i })).not.toBeInTheDocument();
  });

  it('both action buttons are disabled while loading when a scene is active', () => {
    render(
      <PromptInput
        value="test"
        onChange={noop}
        onGenerate={noop}
        onRefine={noop}
        onChipSelect={noop}
        loading={true}
        hasScene={true}
      />,
    );

    expect(screen.getByRole('button', { name: /refine scene/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /new scene/i })).toBeDisabled();
  });

  it('clicking Refine Scene fires onRefine', async () => {
    const onRefine = vi.fn();
    render(
      <PromptInput
        value="add a comet"
        onChange={noop}
        onGenerate={noop}
        onRefine={onRefine}
        onChipSelect={noop}
        loading={false}
        hasScene={true}
      />,
    );

    await userEvent.click(screen.getByRole('button', { name: /refine scene/i }));

    expect(onRefine).toHaveBeenCalledOnce();
  });

  it('placeholder reflects refinement context when a scene is active', () => {
    render(
      <PromptInput
        value=""
        onChange={noop}
        onGenerate={noop}
        onRefine={noop}
        onChipSelect={noop}
        loading={false}
        hasScene={true}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute(
      'placeholder',
      expect.stringContaining('Refine'),
    );
  });
});
