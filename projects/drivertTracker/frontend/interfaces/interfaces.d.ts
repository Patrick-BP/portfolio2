interface Movie {
    id: number;
    title: string;
    adult: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    original_language: string;
    original_title: string;
    popularity: number;
    video: boolean;
    vote_average: number;
    vote_count: number;
    poster_path: string;
    genre_ids: string[];
}

interface TrendingMovie {
    searchTerm: string;
    movie_id: number;
    title: string;
    count: number;
    poster_url: string;
}

interface MovieDetails {
    id: number;
    title: string;
    adult: boolean;
    backdrop_path: string | null;
   belongs_to_collection: null | { }
}