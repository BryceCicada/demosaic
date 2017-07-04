Feature: Nearest neighbour demosaic
  As a user of Demosaic
  I want the nearest neighbour demosaic to produce accurate colour images
  So that I can use it on my raw images.

  Scenario Outline: Nearest neighbour demosaic has low mean-squared error between original and demosaiced pixels
    Given RGB pixels from image <image>
    And I obtain raw pixels from RGB pixels by applying a Bayer CFA with RGGB alignment
    And I save the raw pixels as <raw> as a test artifact
    When I demosaic the raw pixels with nearest neighbour demosaic
    And I save the demosaiced pixels as <bilinear> as a test artifact
    Then the original and demosaiced pixels should have mean-squared-error under <maxMeanSquaredError>

    Examples:
      | image          | raw                | bilinear                        | maxMeanSquaredError |
      | sample.png     | sample.raw.png     | sample.nearestNeighbour.png     | 0                   |
      | aster.jpg      | aster.raw.jpg      | aster.nearestNeighbour.jpg      | 177                 |
      | orange.jpg     | orange.raw.jpg     | orange.nearestNeighbour.jpg     | 394                 |
      | passiflora.jpg | passiflora.raw.jpg | passiflora.nearestNeighbour.jpg | 789                 |
      | poppy.jpg      | poppy.raw.jpg      | poppy.nearestNeighbour.jpg      | 933                 |

  Scenario Outline: Nearest neighbour demosaic has low mean-squared error between colour histograms of original and demosaiced images
    Given RGB pixels from image <image>
    And I obtain raw pixels from RGB pixels by applying a Bayer CFA with RGGB alignment
    When I demosaic the raw pixels with nearest neighbour demosaic
    Then the original and demosaiced colour histograms have correlation within <correlation>

    Examples:
      | image          | correlation   |
      | aster.jpg      | 0.00000000116 |
      | orange.jpg     | 0.000000323   |
      | passiflora.jpg | 0.0010075     |
      | poppy.jpg      | 0.0000254     |