export interface paths {
    "/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["UsersController_findAll"];
        put?: never;
        
        post: operations["AuthController_register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        
        post: operations["AuthController_login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/login/autoLogin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        
        post: operations["AuthController_autoLogin"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["AuthController_confirmEmail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/emails/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        
        post: operations["AuthController_resendConfirmation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/emails/reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        
        post: operations["AuthController_requestPasswordReset"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/confirm/reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        
        post: operations["AuthController_confirmPasswordReset"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/confirm/newPassword": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        
        post: operations["AuthController_resetPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/emails/contact": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        
        post: operations["EmailController_sendContact"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/authors": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["AuthorsController_getAuthors"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/books": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["BooksController_findAll"];
        put?: never;
        
        post: operations["BooksController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/books/homeBooks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["BooksController_getHomeBooks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/books/{ID}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["BooksController_getById"];
        
        put: operations["BooksController_update"];
        post?: never;
        
        delete: operations["BooksController_delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["CategoriesController_getCategories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["HealthController_getStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["PaymentsController_getOrders"];
        put?: never;
        
        post: operations["PaymentsController_createPreference"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/create": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        
        post: operations["PaymentsController_verify"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/webhook": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        
        post: operations["PaymentsController_webhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/payments/{ID}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["PaymentsController_getOrder"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reviews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["ReviewsController_findAll"];
        put?: never;
        
        post: operations["ReviewsController_create"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reviews/user/{ID}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["ReviewsController_findByUser"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reviews/{ID}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        
        put: operations["ReviewsController_update"];
        post?: never;
        
        delete: operations["ReviewsController_delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/stats": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["StatsController_getStats"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/usernames": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["UserLookupsController_getUsernames"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/emails": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["UserLookupsController_getEmails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{ID}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["UsersController_findById"];
        
        put: operations["UsersController_update"];
        post?: never;
        
        delete: operations["UsersController_ban"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{ID}/profile-picture": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        
        post: operations["UsersController_uploadProfilePicture"];
        
        delete: operations["UsersController_removeProfilePicture"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{ID}/favorites": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["UsersController_getFavorites"];
        put?: never;
        
        post: operations["UsersController_addFavorite"];
        
        delete: operations["UsersController_removeFavorite"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/{ID}/cart": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        
        get: operations["UsersController_getCart"];
        put?: never;
        
        post: operations["UsersController_addCartItem"];
        
        delete: operations["UsersController_removeCartItem"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        RegisterDto: {
            
            username: string;
            
            email: string;
            
            name: string;
            
            surname: string;
            password: string;
            profilePic?: string;
        };
        MessageResponseDto: {
            message: string;
        };
        LoginDto: {
            
            username: string;
            password: string;
        };
        
        UserRole: "user" | "admin";
        AuthResponseDto: {
            ID: number;
            username: string;
            email: string;
            name: string;
            surname: string;
            profilePic?: string;
            role: components["schemas"]["UserRole"];
            admin: boolean;
            enabled: boolean;
            banned: boolean;
            suspendedTimes: number;
            
            dateSuspended?: string;
            
            createdAt: string;
            token: string;
        };
        ResendConfirmationDto: {
            username: string;
        };
        ResetRequestDto: {
            
            user: string;
        };
        ResetConfirmDto: {
            ID: string;
            resetCode: string;
        };
        ResetTokenDataDto: {
            resetToken: string;
        };
        ConfirmResetResponseDto: {
            data: components["schemas"]["ResetTokenDataDto"];
            message: string;
        };
        ResetPasswordDto: {
            resetToken: string;
            password: string;
            confirmPassword: string;
        };
        ContactEmailDto: {
            
            sender: string;
            title: string;
            message: string;
        };
        AuthorResponseDto: {
            ID: number;
            name: string;
        };
        ReviewUserSummaryDto: {
            ID: number;
            username: string;
            profilePic?: string;
        };
        BookReviewDto: {
            ID: number;
            title: string;
            review: string;
            rating: number;
            
            createdAt: string;
            bookID: number;
            userID: number;
            user: components["schemas"]["ReviewUserSummaryDto"];
            
            reports: number[];
        };
        BookViewDto: {
            ID: number;
            title: string;
            description: string;
            
            price: string;
            image?: string;
            authors: string[];
            categories: string[];
            publisher?: string;
            publishedDate?: string;
            pageCount?: number;
            rating: number;
            language?: string;
            avgReadingTime?: string;
            soldCopies: number;
            reviews: components["schemas"]["BookReviewDto"][];
            
            createdAt: string;
        };
        HomeBooksResponseDto: {
            bestSellers: components["schemas"]["BookViewDto"][];
            mostPopular: components["schemas"]["BookViewDto"][];
            newReleases: components["schemas"]["BookViewDto"][];
        };
        TaxonomyInputDto: {
            value: string;
            created?: boolean;
        };
        CreateBookDto: {
            title: string;
            description: string;
            
            price: string;
            image?: string;
            authors: components["schemas"]["TaxonomyInputDto"][];
            categories: components["schemas"]["TaxonomyInputDto"][];
            publisher?: string;
            publishedDate?: string;
            pageCount?: number;
            language?: string;
        };
        CategoryResponseDto: {
            ID: number;
            category: string;
            soldCopies: number;
        };
        CreateCheckoutDto: {
            gift?: boolean;
            giftRecipient?: string;
        };
        CheckoutResponseDto: {
            preferenceId: string;
            orderId: number;
        };
        VerifyPaymentDto: {
            
            paymentId: string;
        };
        OrderItemViewDto: {
            ID: number;
            title: string;
            quantity: number;
            
            price: string;
            
            unit_price: string;
            picture_url?: string;
        };
        
        OrderStatus: "pending" | "approved" | "rejected" | "cancelled";
        OrderUserViewDto: {
            ID: number;
            username: string;
            email: string;
        };
        OrderViewDto: {
            ID: number;
            mpID: string;
            preferenceId?: string;
            items: components["schemas"]["OrderItemViewDto"][];
            
            total: string;
            gift: boolean;
            giftrecipient?: string;
            status: components["schemas"]["OrderStatus"];
            user: components["schemas"]["OrderUserViewDto"];
            
            createdAt: string;
        };
        WebhookDataDto: {
            id?: string;
        };
        WebhookBodyDto: {
            data?: components["schemas"]["WebhookDataDto"];
        };
        WebhookResponseDto: {
            
            received: true;
        };
        ReviewBookSummaryDto: {
            ID: number;
            title: string;
            image?: string;
        };
        ReviewViewDto: {
            ID: number;
            title: string;
            review: string;
            rating: number;
            
            createdAt: string;
            bookID: number;
            userID: number;
            book: components["schemas"]["ReviewBookSummaryDto"];
            user: components["schemas"]["ReviewUserSummaryDto"];
            
            reports: number[];
        };
        UserReviewsResponseDto: {
            ID: number;
            username: string;
            name: string;
            surname: string;
            profilePic?: string;
            reviews: components["schemas"]["ReviewViewDto"][];
        };
        CreateReviewDto: {
            title: string;
            review: string;
            rating: number;
            bookID: number;
        };
        UpdateReviewDto: {
            title?: string;
            review?: string;
            rating?: number;
        };
        StatsBookDto: {
            ID: number;
            title: string;
            image?: string;
            soldCopies: number;
        };
        StatsCategoryDto: {
            ID: number;
            category: string;
            soldCopies: number;
        };
        StatsCreatedDateDto: {
            
            createdAt: string;
        };
        StatsUsersDto: {
            totalUsers: number;
            createdDate: components["schemas"]["StatsCreatedDateDto"][];
        };
        StatsPaymentDto: {
            items: number;
            
            createdAt: string;
            
            total: string;
        };
        StatsResponseDto: {
            books: components["schemas"]["StatsBookDto"][];
            categories: components["schemas"]["StatsCategoryDto"][];
            users: components["schemas"]["StatsUsersDto"];
            payments: components["schemas"]["StatsPaymentDto"][];
        };
        UserAdminViewDto: {
            ID: number;
            username: string;
            name: string;
            surname: string;
            profilePic?: string;
            role: components["schemas"]["UserRole"];
            admin: boolean;
            enabled: boolean;
            banned: boolean;
            suspendedTimes: number;
            
            createdAt: string;
            email: string;
        };
        UserPublicViewDto: {
            ID: number;
            username: string;
            name: string;
            surname: string;
            profilePic?: string;
            role: components["schemas"]["UserRole"];
            admin: boolean;
            enabled: boolean;
            banned: boolean;
            suspendedTimes: number;
            
            createdAt: string;
        };
        UpdateUserResponseDto: {
            message: string;
            data: components["schemas"]["UserPublicViewDto"];
        };
        UpdateUserDto: {
            username?: string;
            name?: string;
            surname?: string;
            
            email?: string;
            profilePic?: string;
            password?: string;
            newPassword?: string;
        };
        FavoriteTimestampDto: {
            
            createdAt: string;
        };
        FavoriteBookDto: {
            ID: number;
            title: string;
            description: string;
            
            price: string;
            image?: string;
            authors: string[];
            categories: string[];
            publisher?: string;
            publishedDate?: string;
            pageCount?: number;
            rating: number;
            language?: string;
            avgReadingTime?: string;
            soldCopies: number;
            reviews: components["schemas"]["BookReviewDto"][];
            
            createdAt: string;
            user_bookfav: components["schemas"]["FavoriteTimestampDto"];
        };
        BookIdDto: {
            ID: number;
        };
        FavoritesResponseDto: {
            data: components["schemas"]["FavoriteBookDto"][];
            message: string;
        };
        CartBookDto: {
            ID: number;
            title: string;
            description: string;
            
            price: string;
            image?: string;
            authors: string[];
            categories: string[];
            publisher?: string;
            publishedDate?: string;
            pageCount?: number;
            rating: number;
            language?: string;
            avgReadingTime?: string;
            soldCopies: number;
            reviews: components["schemas"]["BookReviewDto"][];
            
            createdAt: string;
            user_bookcart: components["schemas"]["FavoriteTimestampDto"];
        };
        CartResponseDto: {
            data: components["schemas"]["CartBookDto"][];
            message: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    UsersController_findAll: {
        parameters: {
            query: {
                username: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserAdminViewDto"][];
                };
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_register: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthResponseDto"];
                };
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_autoLogin: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthResponseDto"];
                };
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_confirmEmail: {
        parameters: {
            query: {
                token: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_resendConfirmation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResendConfirmationDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_requestPasswordReset: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResetRequestDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_confirmPasswordReset: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResetConfirmDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConfirmResetResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthController_resetPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResetPasswordDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    EmailController_sendContact: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ContactEmailDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    AuthorsController_getAuthors: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AuthorResponseDto"][];
                };
            };
        };
    };
    BooksController_findAll: {
        parameters: {
            query?: {
                title?: string;
                author?: string;
                category?: string;
                page?: number;
                pageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookViewDto"][];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    BooksController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateBookDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    BooksController_getHomeBooks: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HomeBooksResponseDto"];
                };
            };
        };
    };
    BooksController_getById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BookViewDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    BooksController_update: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateBookDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    BooksController_delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    CategoriesController_getCategories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CategoryResponseDto"][];
                };
            };
        };
    };
    HealthController_getStatus: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
    PaymentsController_getOrders: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderViewDto"][];
                };
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentsController_createPreference: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCheckoutDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CheckoutResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentsController_verify: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VerifyPaymentDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderViewDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentsController_webhook: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WebhookBodyDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WebhookResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    PaymentsController_getOrder: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OrderViewDto"];
                };
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReviewsController_findAll: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReviewViewDto"][];
                };
            };
        };
    };
    ReviewsController_create: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateReviewDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReviewsController_findByUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserReviewsResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReviewsController_update: {
        parameters: {
            query: {
                report: string;
            };
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateReviewDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    ReviewsController_delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    StatsController_getStats: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StatsResponseDto"];
                };
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UserLookupsController_getUsernames: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string[];
                };
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UserLookupsController_getEmails: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": string[];
                };
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_findById: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserPublicViewDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_update: {
        parameters: {
            query: {
                suspended: string;
                enabled: string;
                admin: string;
            };
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateUserDto"];
            };
        };
        responses: {
            
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UpdateUserResponseDto"] | components["schemas"]["UserAdminViewDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_ban: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MessageResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_uploadProfilePicture: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    
                    file: string;
                };
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UpdateUserResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_removeProfilePicture: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UpdateUserResponseDto"];
                };
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_getFavorites: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FavoriteBookDto"][];
                };
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_addFavorite: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BookIdDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FavoritesResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_removeFavorite: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BookIdDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FavoritesResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_getCart: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CartBookDto"][];
                };
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_addCartItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BookIdDto"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CartResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    UsersController_removeCartItem: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                ID: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["BookIdDto"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CartResponseDto"];
                };
            };
            
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
