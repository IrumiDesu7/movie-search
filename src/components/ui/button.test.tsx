import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button component", () => {
  it("renders with label and responds to clicks", async () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Press me</Button>);

    const btn = screen.getByRole("button", { name: /press me/i });
    await userEvent.click(btn);

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(btn).toHaveTextContent("Press me");
  });
});
