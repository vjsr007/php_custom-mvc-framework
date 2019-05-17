<?php

class Product extends Model {
	var $hasOne = array('Category' => 'Category');
	var $hasManyAndBelongsToMany = array('Tag' => 'Tag');
}