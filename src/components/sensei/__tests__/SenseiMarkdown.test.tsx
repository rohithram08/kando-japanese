import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import SenseiMarkdown from '../SenseiMarkdown';

describe('SenseiMarkdown Component', () => {
  it('renders bold and italic text properly without raw asterisks', () => {
    const { container } = render(
      <SenseiMarkdown content="Keep your **3-day streak** alive and study *te-form*!" />
    );

    expect(screen.getByText('3-day streak')).toBeDefined();
    expect(screen.getByText('te-form')).toBeDefined();
    expect(container.textContent).not.toContain('**');
    expect(container.textContent).not.toContain('*te-form*');
  });

  it('renders markdown headings without hash symbols', () => {
    const { container } = render(
      <SenseiMarkdown content={"# Welcome to Japanese\n## Today's Lesson"} />
    );

    const h1 = container.querySelector('h1');
    const h2 = container.querySelector('h2');
    expect(h1).not.toBeNull();
    expect(h1?.textContent).toBe('Welcome to Japanese');
    expect(h2).not.toBeNull();
    expect(h2?.textContent).toBe("Today's Lesson");
    expect(container.textContent).not.toContain('#');
  });

  it('renders bullet lists cleanly', () => {
    const { container } = render(
      <SenseiMarkdown content={"* First item\n* Second item\n* Third item"} />
    );
    const listItems = container.querySelectorAll('li');
    expect(listItems.length).toBe(3);
    expect(listItems[0].textContent).toContain('First item');
    expect(listItems[1].textContent).toContain('Second item');
    expect(listItems[2].textContent).toContain('Third item');
  });

  it('renders inline code blocks correctly', () => {
    const { container } = render(
      <SenseiMarkdown content="Use the `kudasai` grammar point." />
    );

    const code = container.querySelector('code');
    expect(code).not.toBeNull();
    expect(code?.textContent).toBe('kudasai');
    expect(container.textContent).not.toContain('`');
  });

  it('handles empty or null content gracefully', () => {
    const { container } = render(<SenseiMarkdown content="" />);
    expect(container.firstChild).toBeNull();
  });
});
