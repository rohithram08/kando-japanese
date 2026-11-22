import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import SenseiActionStrip, { HANA_ACTIONS } from '../SenseiActionStrip';

afterEach(() => cleanup());

describe('SenseiActionStrip', () => {
  const defaultProps = {
    currentAction: 'idle' as const,
    onSelectAction: vi.fn(),
    cameraMode: 'full' as const,
    onSelectCamera: vi.fn(),
    slimeAccessory: 'auto' as const,
    onSelectAccessory: vi.fn(),
  };

  it('renders quick action buttons', () => {
    render(<SenseiActionStrip {...defaultProps} />);
    expect(screen.getByText('3D Actions')).toBeDefined();
  });

  it('triggers onSelectAction when an action is clicked', () => {
    const onSelectAction = vi.fn();
    render(<SenseiActionStrip {...defaultProps} onSelectAction={onSelectAction} />);

    // Click on the first quick action (Ojigi Bow)
    const firstAction = HANA_ACTIONS[0];
    const button = screen.getByTitle(new RegExp(firstAction.label, 'i'));
    fireEvent.click(button);

    expect(onSelectAction).toHaveBeenCalledWith(firstAction.id);
  });

  it('switches camera angle when camera buttons are clicked', () => {
    const onSelectCamera = vi.fn();
    render(<SenseiActionStrip {...defaultProps} onSelectCamera={onSelectCamera} />);

    const teachButton = screen.getByTitle(/Teaching Focus/i);
    fireEvent.click(teachButton);
    expect(onSelectCamera).toHaveBeenCalledWith('teaching');

    const portraitButton = screen.getByTitle(/Portrait Close-Up/i);
    fireEvent.click(portraitButton);
    expect(onSelectCamera).toHaveBeenCalledWith('portrait');
  });

  it('expands full drawer and allows selecting slime accessories', () => {
    const onSelectAccessory = vi.fn();
    render(<SenseiActionStrip {...defaultProps} onSelectAccessory={onSelectAccessory} />);

    // Expand drawer
    const expandButton = screen.getByTitle(/Expand Unity Action Studio/i);
    fireEvent.click(expandButton);

    expect(screen.getByText('Hana-Sensei Actions')).toBeDefined();
    expect(screen.getByText('Slime Companion Hat')).toBeDefined();

    const capButton = screen.getByTitle('Sensei Cap');
    fireEvent.click(capButton);
    expect(onSelectAccessory).toHaveBeenCalledWith('sensei_hat');
  });
});
