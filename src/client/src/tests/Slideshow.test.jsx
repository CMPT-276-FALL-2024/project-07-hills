import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Slideshow from "../components/Slideshow";

describe("Slideshow Component", () => {
  const mockImages = [
    {
      url: "image1.jpg",
      alt: "First Image",
      description: "First Image Description"
    },
    {
      url: "image2.jpg",
      alt: "Second Image",
      description: "Second Image Description"
    }
  ];

  it("renders initial image", () => {
    const { container } = render(<Slideshow images={mockImages} />);
    
    const image = container.querySelector('img[alt="First Image"]');
    expect(image).toBeInTheDocument();
    expect(image).toHaveStyle({ transform: "translateX(0%)" });
    expect(screen.getByText("First Image Description")).toBeInTheDocument();
  });

  it("navigates to next image", () => {
    const { container } = render(<Slideshow images={mockImages} />);
    
    const nextButton = screen.getByLabelText("View Next Image");
    fireEvent.click(nextButton);
    
    const secondImage = container.querySelector('img[alt="Second Image"]');
    expect(secondImage).toHaveStyle({ transform: "translateX(0%)" });
    expect(screen.getByText("Second Image Description")).toBeInTheDocument();
  });

  it("navigates to previous image", () => {
    const { container } = render(<Slideshow images={mockImages} />);
    
    const prevButton = screen.getByLabelText("View Previous Image");
    fireEvent.click(prevButton);
    
    const secondImage = container.querySelector('img[alt="Second Image"]');
    expect(secondImage).toHaveStyle({ transform: "translateX(0%)" });
  });

  it("renders correct number of navigation dots", () => {
    render(<Slideshow images={mockImages} />);
    
    const dots = screen.getAllByLabelText(/view image \d+/i);
    expect(dots).toHaveLength(mockImages.length);
  });

  it("updates active dot when navigating", () => {
    const { container } = render(<Slideshow images={mockImages} />);
    
    const nextButton = screen.getByLabelText("View Next Image");
    fireEvent.click(nextButton);
    
    const dots = screen.getAllByLabelText(/view image \d+/i);
    const secondDot = dots[1];
    expect(secondDot).toBeInTheDocument();
    expect(secondDot.firstChild).toHaveClass("fill-black");
  });

  it("handles circular navigation", () => {
    const { container } = render(<Slideshow images={mockImages} />);
    const nextButton = screen.getByLabelText("View Next Image");
    
    // Go past the last image
    fireEvent.click(nextButton);
    fireEvent.click(nextButton);
    
    const firstImage = container.querySelector('img[alt="First Image"]');
    expect(firstImage).toHaveStyle({ transform: "translateX(0%)" });
  });
});