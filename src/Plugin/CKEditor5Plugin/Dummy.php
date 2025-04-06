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
      '#title' => $this->t('Classes', [], self::T_CONTEXT),
      '#description' => $this->t('Classes for SPAN container to support as a dummy model.', [], self::T_CONTEXT),
      '#default_value' => $this->configuration['classes'],
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
    $this->configuration['classes'] = Html::getClass(trim($form_state->getValue('classes')));
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'classes' => '',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getElementsSubset(): array {
    return ['<span>', '<span class>'];
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
