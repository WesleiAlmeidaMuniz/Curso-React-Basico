import { render, screen, waitFor } from "@testing-library/react"
import { Toggle } from ".."
import userEvent from "@testing-library/user-event";

describe('<Toggle />', () => {
    it('the initial valur of dark mode should be false', () => {
        render(<Toggle isDark={false} handleDark={jest.fn()} />);
        const switchComponent = screen.getByLabelText("switch para trocar de cor");
        expect(switchComponent).toBeInTheDocument();
        expect(switchComponent).toHaveClass("left-0");
    });

    it('onClick should change the color' , async () => {
        const handleClick = jest.fn();
        render(<Toggle isDark={true} handleDark={handleClick} />);
        const getParentElement = screen.getByLabelText("toggle trocar modo escuro");
        const switchComponent = screen.getByLabelText("switch para trocar de cor");

        expect(getParentElement).toBeInTheDocument();
        userEvent.click(getParentElement);
        expect(handleClick).toHaveBeenCalled();

        await waitFor(() => {
            expect(switchComponent).toHaveClass('right-0');
        });
    });
});