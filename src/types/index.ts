export interface Apartment {
    id: number;
    complex: string;
    address: string;
    rooms: number;
    floor: number;
    bathroom: string;
    finishing: string;
    isHot: boolean;
    image: string;
    detailsUrl: string;
}

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: () => void;
}

export interface ApartmentCardProps {
    apartment: Apartment,
    onNavigateToApartment?: () => void,
}

export interface HomePageProps {
    onNavigateToComplex?: () => void;
}

export interface ApartmentPageProps {
    onNavigateBack: () => void;
}