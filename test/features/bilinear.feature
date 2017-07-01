Feature: Bilinear demosaic
  As a user of Demosaic
  I want the bilinear demosaic to produce accurate colour images
  So that I can use it on my raw images.

  Scenario Outline: Bilinear demosaic has low mean-squared error between original and demosaiced pixels
    Given RGB pixels from image <image>
    And I obtain raw pixels from RGB pixels by applying a Bayer CFA with RGGB alignment
    And I save the raw pixels as <raw> as a test artifact
    When I demosaic the raw pixels with bilinear demosaic
    And I save the demosaiced pixels as <bilinear> as a test artifact
    Then the original and demosaiced pixels should have mean-squared-error under <maxMeanSquaredError>

    Examples:
      | image     | raw           | bilinear           | maxMeanSquaredError |
      | leaf.jpg  | leaf.raw.jpg  | leaf.bilinear.jpg  | 35                  |
      | woods.jpg | woods.raw.jpg | woods.bilinear.jpg | 200                 |

  Scenario Outline: Bilinear demosaic has low mean-squared error between colour histograms of original and demosaiced images
    Given RGB pixels from image <image>
    And I obtain raw pixels from RGB pixels by applying a Bayer CFA with RGGB alignment
    When I demosaic the raw pixels with bilinear demosaic
    Then the original and demosaiced colour histograms should have mean-squared-error under <maxMeanSquaredError>

    Examples:
      | image     | maxMeanSquaredError |
      | leaf.jpg  | 1100                |
      | woods.jpg | 4000                |