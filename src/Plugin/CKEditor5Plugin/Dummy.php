<?php

namespace Drupal\dummy\Plugin\CKEditor5Plugin;

use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableTrait;
use Drupal\ckeditor5\Plugin\CKEditor5PluginDefault;
use Drupal\ckeditor5\Plugin\CKEditor5PluginElementsSubsetInterface;
use Drupal\Component\Utility\Html;
use Drupal\Core\Form\FormStateInterface;
use Drupal\editor\EditorInterface;

/**
 * CKEditor 5 Dummy plugin configuration.
 *
 * @internal
 *   Plugin classes are internal.
 */
class Dummy extends CKEditor5PluginDefault implements CKEditor5PluginConfigurableInterface, CKEditor5PluginElementsSubsetInterface {

  use CKEditor5PluginConfigurableTrait;

  const T_CONTEXT = ['context' => 'Dummy module'];

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {
    $form['classes'] = [
      '#type' => 'textfield',
      '#title' => $this->t('SPAN classes', [], self::T_CONTEXT),
      '#description' => $this->t('Classes for SPAN container to support as a dummy model.', [], self::T_CONTEXT),
      '#default_value' => $this->configuration['classes'],
    ];

    $form['classes_div'] = [
      '#type' => 'textfield',
      '#title' => $this->t('DIV classes', [], self::T_CONTEXT),
      '#description' => $this->t('Classes for DIV container to support as a dummy model.', [], self::T_CONTEXT),
      '#default_value' => $this->configuration['classes_div'],
    ];

    $form['classes_ol'] = [
      '#type' => 'textfield',
      '#title' => $this->t('OL classes', [], self::T_CONTEXT),
      '#description' => $this->t('Classes for OL container to support as a dummy model.', [], self::T_CONTEXT),
      '#default_value' => $this->configuration['classes_ol'],
    ];

    $form['classes_ul'] = [
      '#type' => 'textfield',
      '#title' => $this->t('UL classes', [], self::T_CONTEXT),
      '#description' => $this->t('Classes for UL container to support as a dummy model.', [], self::T_CONTEXT),
      '#default_value' => $this->configuration['classes_ul'],
    ];


    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state) {
    ;
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state) {
    $fieldNames = ['classes', 'classes_div', 'classes_ol', 'classes_ul'];

    foreach($fieldNames as $fieldName) {
      $classes = preg_split("/[\s,]+/", trim($form_state->getValue($fieldName)));
      $classesList = [];
      foreach ($classes as $className) {
        if (strlen($className)) {
          $classesList[] = Html::cleanCssIdentifier($className);
        }
      }

      $this->configuration[$fieldName] = implode(' ', $classesList);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'classes' => '',
      'classes_div' => '',
      'classes_ol' => '',
      'classes_ul' => '',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getElementsSubset(): array {
    return ['<span>', '<span class>', '<div>', '<div class>', '<ul>', '<ul class>', '<ol>', '<ol class>'];
  }

  /**
   * {@inheritdoc}
   */
  public function getDynamicPluginConfig(array $static_plugin_config, EditorInterface $editor): array {
    return [
      'dummy' => $this->configuration,
    ];
  }

}
