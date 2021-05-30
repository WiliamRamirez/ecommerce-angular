import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../common/product';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-product-list',
    templateUrl: './product-list-grid.component.html',
    styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
    products: Product[] = [];
    currentCategoryId = 1;
    previousCategoryId = 1;
    searchMode = false;

    thePageNumber = 1;
    thePageSize = 5;
    theTotalElements = 0;
    previousKeyword: string = null;

    constructor(private productService: ProductService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.route.paramMap.subscribe(() => {
            this.listProducts();
        });
    }

    listProducts(): void {
        this.searchMode = this.route.snapshot.paramMap.has('keyword');
        if (this.searchMode) {
            this.handleSearchProducts();
        } else {
            this.handleListProducts();
        }
    }
    handleSearchProducts(): void {
        const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

        if (this.previousKeyword !== theKeyword) {
            this.thePageNumber = 1;
        }

        this.previousKeyword = theKeyword;

        this.productService
            .searchProductsPaginate(this.thePageNumber - 1, this.thePageSize, theKeyword)
            .subscribe(this.processResult());
    }

    handleListProducts(): void {
        /* verificar si el parametro id esta activo  */
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

        if (hasCategoryId) {
            /*Obtener el parametro id en string, y convertir de string a number con el simbolo +*/
            this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
        } else {
            this.currentCategoryId = 1;
        }

        if (this.previousCategoryId !== this.currentCategoryId) {
            this.thePageNumber = 1;
        }

        this.previousCategoryId = this.currentCategoryId;

        this.productService
            .getProductListPaginate(
                this.thePageNumber - 1,
                this.thePageSize,
                this.currentCategoryId
            )
            .subscribe(this.processResult());
    }

    processResult(): any {
        return (data) => {
            this.products = data._embedded.products;
            this.thePageNumber = data.page.number + 1;
            this.thePageSize = data.page.size;
            this.theTotalElements = data.page.totalElements;
        };
    }

    updatePageSize(pageSize: number): void {
        this.thePageSize = pageSize;
        this.thePageNumber = 1;
        this.listProducts();
    }
}
