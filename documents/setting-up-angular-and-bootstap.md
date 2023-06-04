# Setting up Angular and Bootstrap

## Introduction

Angular is great, but has some limitations when it comes to styling. Bootstrap is a great framework for styling, but
it's not always easy to integrate with Angular. This guide will show you how to set up Angular and Bootstrap so that you
can use Bootstrap's styling in your Angular project.

## Disclaimer

This guide is based on another article by Amadou Sall. You can find the original
article [here](https://www.amadousall.com/the-best-parts-of-bootstrap-you-are-missing-in-angular-material/). This
write-up is not meant to replace the original article, but rather to provide a quick reference for setting up Angular
and Bootstrap and fix some issues introduced in Bootstrap 5.2.

## Adding Bootstrap

### Installing Bootstrap

```bash
npm install bootstrap -S
```

### Basic imports into your style.scss

In the original article 'variables-dark' and 'maps' were not included. This caused issues the root variables.
Another issue that I had to resolve was the ~ link no longer worked, and I replaced it with the node_modules path
instead.

```scss
// Import functions, variables, and mixins needed by other Bootstrap files
@import 'node_modules/bootstrap/scss/functions';
@import 'node_modules/bootstrap/scss/variables';
@import 'node_modules/bootstrap/scss/variables-dark';
@import 'node_modules/bootstrap/scss/mixins';
@import 'node_modules/bootstrap/scss/maps';

// Contains :root CSS variables used by other Bootstrap files
@import 'node_modules/bootstrap/scss/root';
// Import Bootstrap Reboot
@import 'node_modules/bootstrap/scss/reboot';
```

### Fixing some issues caused by Bootstrap Reboot

Add a _variables.scss file to your project and add the following code:

```scss
$link-color: #673ab7;
$label-margin-bottom: 0;
```

I added mine to a 'styles' subdirectory.
Import it before the Bootstrap variables:

```scss
@import 'styles/variables';
```

Remember this file as we will come back to it later.

Add a reset.scss file to your project and add the following code:
This fixes issues with Angular's anchor buttons.

```scss
a {
  &.mat-button, &.mat-raised-button, &.mat-fab, &.mat-mini-fab, &.mat-list-item {
    &:hover {
      color: currentColor
    }
  }
}
```

### Importing Bootstrap's container and grid layout

> Bootstrap’s grid system uses a series of containers, rows, and columns to layout and align content. It’s built with
> flexbox and is fully responsive.

```scss
// Import Bootstrap components
@import 'node_modules/bootstrap/scss/containers';
// Add .container and .container-fluid classes
@import 'node_modules/bootstrap/scss/grid';
```

Now we add the grid overrides to the _variables.scss file we created earlier to align with Angular's breakpoint system.

```scss:
$container-max-widths: (
  xs: 0,
  sm: 600px,
  md: 960px,
  lg: 1280px,
  xl: 1920px,
  xxl: 1921px
);

$grid-breakpoints: (
  xs: 0,
  sm: 600px,
  md: 960px,
  lg: 1280px,
  xl: 1920px,
  xxl: 1921px
);
```

### Importing Bootstrap's utilities

Bootstrap's utilities are amazing, and you'll notice I use them throughout this project.
For detailed documentation, see Bootstrap's utilities
documentation [here](https://getbootstrap.com/docs/5.3/layout/utilities/#changing-display)
and [here](https://getbootstrap.com/docs/5.3/utilities/api/).

```scss
@import "~bootstrap/scss/utilities";
// Configures the utility classes that should be generated
@import "~bootstrap/scss/utilities/api"; // Generates the actual utility classes
```

### Spacing utilities

There are 2 schools of thought around spacing in UX.
The first is that spacing works in incremental steps, and the second is that spacing is a ratio.

When looking at Bootstrap's spacing utilities, they do not use equal increments:
> 0 - for classes that eliminate the margin or padding by setting it to 0
> 1 - (by default) for classes that set the margin or padding to $spacer * .25
> 2 - (by default) for classes that set the margin or padding to $spacer * .5
> 3 - (by default) for classes that set the margin or padding to $spacer
> 4 - (by default) for classes that set the margin or padding to $spacer * 1.5
> 5 - (by default) for classes that set the margin or padding to $spacer * 3

This is NOT wrong, and reduces the number of spacing available to be used through the utilities. With fewer options,
consistency should also improve.
However, I prefer to work in increments of 8px. This aligns a little better Material design, but most of all takes the
guessing out of the UI.
Therefore, in the _variables.scss file we created earlier, we add the following code:

```scss
$spacer: 1rem; // 16px
$spacers: (
  0: $spacer * 0, // 0
  1: $spacer * 0.5, // 8
  2: $spacer * 1, // 16
  3: $spacer * 1.5, // 24
  4: $spacer * 2, // 32
  5: $spacer * 2.5, // 40
  6: $spacer * 3, // 48
  7: $spacer * 3.5, // 56
  8: $spacer * 4, // 64
  9: $spacer * 4.5, // 72
  10: $spacer * 5, // 80
);
```
