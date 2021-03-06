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

    getProductListPaginate(
        thePage: number,
        thePageSize: number,
        theCategoryId: number
    ): Observable<GetResponseProducts> {
        /*@ URL basada en el id de la categoria */
        const searchUrl =
            `${this.baseUrl}/products/search/findByCategoryId?id=${theCategoryId}` +
            `&page=${thePage}&size=${thePageSize}`;
        return this.httpClient.get<GetResponseProducts>(searchUrl);
    }

    getProductList(theCategoryId: number): Observable<Product[]> {
        /*@ URL basada en el id de la categoria */
        const searchUrl = `${this.baseUrl}/products/search/findByCategoryId?id=${theCategoryId}`;
        return this.getProducts(searchUrl);
    }

    searchProducts(theKeyword: string): Observable<Product[]> {
        const searchUrl = `${this.baseUrl}/products/search/findByNameContaining?name=${theKeyword}`;

        return this.getProducts(searchUrl);
    }

    searchProductsPaginate(
        thePage: number,
        thePageSize: number,
        theKeyword: string
    ): Observable<GetResponseProducts> {
        /*@ URL basada en el keyword */
        const searchUrl =
            `${this.baseUrl}/products/search/findByNameContaining?name=${theKeyword}` +
            `&page=${thePage}&size=${thePageSize}`;
        return this.httpClient.get<GetResponseProducts>(searchUrl);
    }

    private getProducts(searchUrl: string): Observable<Product[]> {
        return this.httpClient
            .get<GetResponseProducts>(searchUrl)
            .pipe(map((response) => response._embedded.products));
    }
    getProductCategories(): Observable<ProductCategory[]> {
        const categoryUrl = `${this.baseUrl}/product-category`;
        return this.httpClient
            .get<GetResponseProductCategory>(categoryUrl)
            .pipe(map((response) => response._embedded.productCategory));
    }

    getProduct(theProductId: number): Observable<Product> {
        const productUrl = `${this.baseUrl}/products/${theProductId}`;
        return this.httpClient.get<Product>(productUrl);
    }
}

interface GetResponseProducts {
    _embedded: {
        products: Product[];
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}

interface GetResponseProductCategory {
    _embedded: {
        productCategory: ProductCategory[];
    };
}
