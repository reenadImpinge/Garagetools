<?php

use yii\db\Migration;

/**
 * Handles dropping dimensions from table `materials`.
 */
class m220513_114905_drop_dimensions_column_from_materials_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->dropColumn('materials', 'dimensions');
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->addColumn('materials', 'dimensions', $this->text());
    }
}
