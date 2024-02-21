import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { Details } from "..";
import { PokemonService } from "../../../services/pokemon";
// eslint-disable-next-line jest/no-mocks-import
import { localStorageMock, mockPokemonInfo } from "../../../__mocks__/pokemon";
import userEvent from "@testing-library/user-event";

Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
});

const mockNavigate = jest.fn();
jest.mock('react-router', () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({ id: '1' }),
    useNavigate: () => mockNavigate,
}));

const setup = () => 
    render(
        <MemoryRouter initialEntries={['/details/1']}>
            <Routes>
                <Route path='/details/:id' element={<Details />}/>
            </Routes>
        </MemoryRouter>
    );


describe('<Details />', () => {
    beforeEach(() => {
        jest
        .spyOn(PokemonService, 'searchedPokemon')
        .mockResolvedValue(mockPokemonInfo);
    });

    it('should render details page', () => {
        setup();

        expect(screen.getByText('Pokédex')).toBeInTheDocument();
        expect(screen.getByLabelText(/toggle trocar modo escuro/i)).toBeInTheDocument();
        expect(screen.getByRole('status')).toBeInTheDocument();
        expect(screen.getByText(/carregando/i)).toBeInTheDocument();
    });

    it('should render pokemon card details', async () => {
        const getPokemonsInfoSpy = jest
        .spyOn(PokemonService, 'searchedPokemon')
        .mockResolvedValue(mockPokemonInfo);

        setup();

        expect(getPokemonsInfoSpy).toHaveBeenCalledWith("1");

        expect(await screen.findByText(/voltar/i)).toBeInTheDocument();
        expect(screen.getByText(mockPokemonInfo.name)).toBeInTheDocument();
        expect(screen.getByText(`#${mockPokemonInfo.id}`)).toBeInTheDocument();
        expect(screen.getByLabelText(/imagem do pokémon/i)).toHaveAttribute('src',mockPokemonInfo.sprites.front_default);

        mockPokemonInfo.types.forEach((type) => {
            expect(screen.getByText(type.type.name)).toBeInTheDocument();
        });

        mockPokemonInfo.abilities.forEach((abilitie) => {
            expect(screen.getByText(abilitie.ability.name)).toBeInTheDocument();
        });
    });

    it('should go to home when clicked to back', async () => {
        setup();
        const backBtn = await screen.findByText(/voltar/i);
        expect(backBtn).toBeInTheDocument();
        userEvent.click(backBtn);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    })

    describe('when clicked on toggle to dark mode', () => {
        beforeEach(() => {
            window.sessionStorage.clear();
            jest.resetAllMocks();
        });

        it('should set dark property on main div and session storage', async () => {
            const setItemSpy = jest.spyOn(window.sessionStorage, "setItem");
            setup();
            const toggle = screen.getByLabelText(/toggle trocar modo escuro/i);
            userEvent.click(toggle);
            await waitFor(() => {
                expect(screen.getByTestId("main-div")).toHaveClass("dark");
            });
            expect(setItemSpy).toHaveBeenCalledWith("isDark", "true");
        });
    
        it('should set dark when have value on session storage', async () => {
            const setItemSpy = jest.spyOn(window.sessionStorage, "setItem");
            window.sessionStorage.setItem("isDark", "true");
            setup();
           
            const toggle = screen.getByLabelText("toggle trocar modo escuro");
            userEvent.click(toggle);
            await waitFor(() => {
                expect(screen.getByTestId("main-div")).not.toHaveClass("dark");
            });
            expect(setItemSpy).toHaveBeenCalledWith("isDark", "false");
        }); 
    })
});