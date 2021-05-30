import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    private baseUrl = 'http://localhost:8080/api';

    constructor(private httpClient: HttpClient) {}

    getProductList(theCategoryId: number): Observable<Product[]> {
        /*@ URL basada en el id de la categoria */
        const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${theCategoryId}`;
        return this.getProducts(searchUrl);
    }

    searchProducts(theKeyword: string): Observable<Product[]> {
        const searchUrl = `${this.baseUrl}/products/search/findByNameContaining?name=${theKeyword}`;

        return this.getProducts(searchUrl);
    }

    private getProducts(searchUrl: string): Observable<Product[]> {
        return this.httpClient
            .get<GetResponseProduct>(searchUrl)
            .pipe(map((response) => response._embedded.products));
    }
    getProductCategories(): Observable<ProductCategory[]> {
        const categoryUrl = `${this.baseUrl}/product-category`;
        return this.httpClient
            .get<GetResponseProductCategory>(categoryUrl)
            .pipe(map((response) => response._embedded.productCategory));
    }
}

interface GetResponseProduct {
    _embedded: {
        products: Product[];
    };
}

interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    };
}
