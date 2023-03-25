import Navbar from "../common/Navbar";
import { NavbarOptions } from "../common/Navbar";
import Content from "./Content";
import Header from "./Header";
import Mono from "./Mono";

function App() {
    return <>
        <Navbar selected={NavbarOptions.Main}/>
        <div className="flex justify-center items-center my-8">
            <div className="card max-w-4xl">
                <Header>Cel aplikacji</Header>
                <Content>
                    Aplikacja <img className="h-5 inline" src="static/assets/Logo.png" /> powstała w celu stworzenia wygodnego narzędzia do ekstrakcji i analizy danych o opiniach z serwisu Ceneo.pl.
                    Jest to również mój projekt semestralny z przedmiotu Pracowania Programowania 2 na studiach na kierunku Informatyka Stosowana na UEKu.
                </Content>
                <Header>Opis działania aplikacji</Header>
                <Content>
                    Aby dokonać ekstrakcji danych należy przejść do zakładki&nbsp;
                    <a href="/product/extract">Ekstrakcja</a>&nbsp;
                    i wpisać odpowiedni numer id produktu który chcemy przeanalizować (znajduje się on np. w linku produktu na Ceneo).
                    Jeśli wpisany zostanie prawidłowy numer id produktu, zostaniemy przekierowani na stronę szczegółów produktu, gdzie po pewnym czasie
                    wyświetlą się dane produktu. Listę wszystkich produktów dla których zostały pobrane opinie można znaleźć pod przyciskiem&nbsp;
                    <a href="/product/list">Lista Produktów</a>.
                </Content>
                <Header>Zastosowane biblioteki</Header>
                <Content>
                    <div className="flex justify-evenly">
                        <div>
                            <span className="text-xl">Backend:</span>
                            <ul>
                                <li>Flask (serwer)</li>
                                <li>Pandas (analiza danych)</li>
                                <li>MontyDB (lokalna baza danych)</li>
                                <li>PyMongo (alternatywna baza danych)</li>
                                <li>Python-dotenv (ładowanie zmiennych z pliku .env)</li>
                                <li>BeautifulSoup4 (web scraping)</li>
                                <li>Requests (pobieranie stron)</li>
                                <li>XLSXwriter (zapisywanie plików xlsx)</li>
                            </ul>
                        </div>
                        <div>
                            <span className="text-xl">Frontend:</span>
                            <ul>
                                <li>Typescript (język - rozwinięcie JS)</li>
                                <li>React (framework frontentdowy)</li>
                                <li>Sass (framework CSS)</li>
                                <li>Tailwind (framework CSS)</li>
                                <li>Webpack (budowanie Typescriptu, Tailwinda oraz Sass)</li>
                                <li>Concurrently (utility do startowania dwóch serwerów naraz)</li>
                                <li>Chart.js (framework do wykresów)</li>
                                <li>React-icons (wielka paczka ikon łatwych do użycia z Reactem)</li>
                                <li>Parę pomniejszych utility i komponentów, pełna lista znajduje się w pliku package.json</li>
                            </ul>
                        </div>
                    </div>
                </Content>
                <Header>Zastosowane podejścia</Header>
                <Content>
                    <span className="text-xl">Backend:</span>
                    <ul>
                        <li>Separacja logiki endpointów i logiki ekstrakcji danych do osobnych plików (odpowiednio <Mono>app.py</Mono>i <Mono>helpers.py</Mono>)</li>
                        <li>Dwie zamienne bazy danych, konfigurowalne przez plik .env, domyślne MontyDB które działa na plikach lokalnych, i alternatywne PyMongo które łączy się z instancją MongoDB</li>
                        <li>Zabezpieczenie przed odświeżeniem strony podczas pobierania opinii</li>
                        <li>Klasy pomocnicze do ekstrakcji danych <Mono>QueryResults</Mono> i <Mono>Reviews</Mono></li>
                        <li>Klasa ułatwiająca operację na gotowych danych <Mono>Product</Mono></li>
                        <li>Pobieranie plików CSV, XLSX, i JSON przez dodanie odpowiedniego rozszerzenia na końcu linku produktu (np. <Mono>/products/138536499.csv</Mono>)</li>
                        <li>Jeden template przekazujący dane do odpowiedniej części frontendu na podstawie przekazanych danych</li>
                    </ul>
                    <span className="text-xl">Frontend:</span>
                    <ul>
                        <li>Użycie Typescriptu zamiast JS, co pozwala na uniknięcie wielu potencjalnych bugów</li>
                        <li>Użycie Webpacka do automatycznej budowy TS, Tailwinda i Sass do standardowych plików JS i CSS na bieżąco (wystarczy uruchomić komendę <Mono>yarn run dev</Mono>, i uruchomią się jednocześnie serwery deweloperskie Flaska i Webpacka - oba automatycznie przeładowują stronę przy zmianie odpowiednich plików)</li>
                        <li>Separacja komponentów</li>
                        <li>Separacja plików CSS od TS</li>
                        <li>Użycie inline Tailwinda do stylowania komponentów które się nie powtarzają</li>
                        <li>Wspólne komponenty (np. <Mono>common/Navbar.tsx</Mono>)</li>
                    </ul>
                </Content>
            </div>
        </div>
    </>;
}

export default App;