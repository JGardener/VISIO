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
        onChipSelect={noop}
        loading={true}
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
        onChipSelect={onChipSelect}
        loading={false}
      />,
    );

    const chips = screen.getAllByRole('button', { name: /nebula/i });
    await userEvent.click(chips[0]);

    expect(onChipSelect).toHaveBeenCalledOnce();
    expect(onChipSelect).toHaveBeenCalledWith(
      'A nebula with swirling purple and blue particles',
    );
  });
});
