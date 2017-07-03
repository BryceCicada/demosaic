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
      | image          | raw                | bilinear                | maxMeanSquaredError |
      | aster.jpg      | aster.raw.jpg      | aster.bilinear.jpg      | 88                  |
      | orange.jpg     | orange.raw.jpg     | orange.bilinear.jpg     | 156                 |
      | passiflora.jpg | passiflora.raw.jpg | passiflora.bilinear.jpg | 357                 |
      | poppy.jpg      | poppy.raw.jpg      | poppy.bilinear.jpg      | 445                 |

  Scenario Outline: Bilinear demosaic has low mean-squared error between colour histograms of original and demosaiced images
    Given RGB pixels from image <image>
    And I obtain raw pixels from RGB pixels by applying a Bayer CFA with RGGB alignment
    When I demosaic the raw pixels with bilinear demosaic
    Then the original and demosaiced colour histograms should have mean-squared-error under <maxMeanSquaredError>

    Examples:
      | image          | maxMeanSquaredError |
      | aster.jpg      | 782                 |
      | orange.jpg     | 10166               |
      | passiflora.jpg | 1413                |
      | poppy.jpg      | 865                 |