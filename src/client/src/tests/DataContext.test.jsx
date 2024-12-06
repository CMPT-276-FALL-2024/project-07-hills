import React, { useContext } from "react";
import { render, act } from "@testing-library/react";
import { DataContext, DataProvider } from "../components/DataContext";

describe("DataContext", () => {
  it("provides songs state and setter", () => {
    let contextValue;
    const TestComponent = () => {
      contextValue = useContext(DataContext);
      return null;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    expect(contextValue.songs).toEqual([]);
    expect(typeof contextValue.setSongs).toBe("function");
  });

  it("updates songs state correctly", () => {
    let contextValue;
    const TestComponent = () => {
      contextValue = useContext(DataContext);
      return null;
    };

    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );

    act(() => {
      contextValue.setSongs([{ id: 1, title: "Test Song" }]);
    });

    expect(contextValue.songs).toEqual([{ id: 1, title: "Test Song" }]);
  });
});