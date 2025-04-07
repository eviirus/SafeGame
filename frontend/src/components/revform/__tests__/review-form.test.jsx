import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import ReviewForm from '../review-form';

describe('ReviewForm Component', () => {
  test('turėtų atvaizduoti 5 reitingo mygtukus + pateikimo mygtuką', () => {
    render(<ReviewForm />);
    const starButtons = screen.getAllByRole('button');
    expect(starButtons.length).toBe(6);
  });

  test('spustelėjus žvaigždutę, nustatomas atitinkamas reitingas', () => {
    render(<ReviewForm />);
    const starButtons = screen.getAllByRole('button');
    fireEvent.click(starButtons[0]);
    expect(starButtons[0]).toHaveAttribute('data-active', 'true');
    fireEvent.click(starButtons[2]);
    expect(starButtons[2]).toHaveAttribute('data-active', 'true');
    expect(starButtons[0]).not.toHaveAttribute('data-active', 'true');
  });

  test('leidžia įvesti tekstinį atsiliepimą į textarea lauką', () => {
    render(<ReviewForm />);
    const textArea = screen.getByPlaceholderText('Įrašykite savo atsiliepimą...');
    fireEvent.change(textArea, { target: { value: 'Puikus produktas!' } });
    expect(textArea.value).toBe('Puikus produktas!');
  });

  test('iškviečia onSubmitReview su teisingais duomenimis ir išvalo laukus po pateikimo', () => {
    const mockOnSubmitReview = jest.fn();
    render(<ReviewForm onSubmitReview={mockOnSubmitReview} />);
    
    const starButtons = screen.getAllByRole('button');
    const textArea = screen.getByPlaceholderText('Įrašykite savo atsiliepimą...');
    const submitButton = screen.getByRole('button', { name: 'Pateikti' });

    fireEvent.click(starButtons[3]);
    fireEvent.change(textArea, { target: { value: 'Labai gerai!' } });
    fireEvent.click(submitButton);

    expect(mockOnSubmitReview).toHaveBeenCalledWith({
      rating: 4,
      reviewText: 'Labai gerai!',
    });

    expect(starButtons[3]).not.toHaveAttribute('data-active', 'true');
    expect(textArea.value).toBe('');
  });
});
