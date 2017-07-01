Feature: Bilinear demosaic
  As a user of Demosaic
  I want to perform a bilinear demosaic of my raw pixels
  So that I can see colour images

  Scenario Outline: Bilinear demosaic of small image with lots of red.
    Given RGB pixels from image <image>
    And I obtain raw pixels from RGB pixels by applying a Bayer CFA with RGGB alignment
    And I save the raw pixels as <raw> as a test artifact
    When I demosaic the raw pixels with bilinear demosaic
    And I save the demosaiced pixels as <bilinear> as a test artifact
    Then the demosaiced pixels and original RGB pixels should have mean-squared-error under <mseUpperBound>

    Examples:
      | image     | raw           | bilinear           | mseUpperBound |
      | leaf.jpg  | leaf.raw.jpg  | leaf.bilinear.jpg  | 35            |
      | woods.jpg | woods.raw.jpg | woods.bilinear.jpg | 200           |