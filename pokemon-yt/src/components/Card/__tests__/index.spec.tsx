import { render, screen } from "@testing-library/react";
import { Card } from "..";
// eslint-disable-next-line jest/no-mocks-import
import { mockPokemonInfo, mockPokemonSearchMock } from "../../../__mocks__/pokemon"
import { PokemonService } from "../../../services/pokemon";
import userEvent from "@testing-library/user-event";

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

describe('<Card/>', () => {
    const simplePokemon = mockPokemonSearchMock.results[0];

    beforeEach(() => {
        jest.spyOn(PokemonService, 'getPokemon').mockResolvedValue(mockPokemonInfo);
    });

    it('should render the card with a simple Pokemon', async () => {
        const mockPokemonSpy = jest.spyOn(PokemonService, 'getPokemon').mockResolvedValue(mockPokemonInfo);

        render(<Card simplePokemon={simplePokemon} />);
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(mockPokemonSpy).toHaveBeenCalledWith(simplePokemon.url);
        expect(await screen.findByText(mockPokemonInfo.name)).toBeInTheDocument();
        expect(await screen.findByText(`#${mockPokemonInfo.id}`)).toBeInTheDocument();

        mockPokemonInfo.types.forEach((type) => {
            expect(screen.getByText(type.type.name)).toBeInTheDocument();
        });

        expect(screen.getByLabelText(/imagem do pokémon/i)).toHaveAttribute('src', mockPokemonInfo.sprites.front_default);
    });

    it('should navigate to details page hen clicked on card', () =>{
        render(<Card simplePokemon={simplePokemon}/>);

        const card = screen.getByLabelText('card pokemon');
        userEvent.click(card);
        expect(mockNavigate).not.toHaveBeenCalledWith(`/details/${mockPokemonInfo.id}`);
    })
});